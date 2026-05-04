// add comments on post
import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const { comment } = await req.json();

    // Read JWT directly — more reliable than auth() in Route Handlers with NextAuth v5 beta
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: "authjs.session-token", // required in NextAuth v5
    });

    console.log("[COMMENT DEBUG] raw token:", JSON.stringify(token, null, 2));

    // token.userId is set by our JWT callback for new sessions.
    // For older sessions, it's missing — fall back to a DB lookup by email.
    // NEVER use token.sub as a MongoDB ID (it's a Google/GitHub UUID, not an ObjectId).
    let userId = token?.userId as string | undefined;
    if (!userId && token?.email) {
      const dbUser = await dataBasePrisma.user.findUnique({
        where: { email: token.email as string },
        select: { id: true },
      });
      userId = dbUser?.id;
    }

    const userName = token?.userName as string | undefined;
    const userName2 = token?.name as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be signed in to comment." },
        { status: 401 }
      );
    }

    const usr = await dataBasePrisma.user.findUnique({
      where: { id: userId },
      select: { username: true, image: true, name: true },
    });

    // user can write maximum 5 comments on a post
    const userCommentCount = await dataBasePrisma.comment.count({
      where: { UserId: userId, BlogId: id },
    });
    if (userCommentCount >= 5) {
      return NextResponse.json(
        { success: false, message: "You can write a maximum of 5 comments on a post." },
        { status: 400 }
      );
    }

    const res = await dataBasePrisma.comment.create({
      data: {
        comment,
        BlogId: id,
        UserId: userId,
        UserName: userName ?? usr?.username ?? "",
        UserImage: usr?.image ?? null,
        name: usr?.name ?? userName2 ?? "",
      },
    });

    return NextResponse.json(
      { success: true, message: "Comment added successfully", data: res },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADD COMMENT]", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
