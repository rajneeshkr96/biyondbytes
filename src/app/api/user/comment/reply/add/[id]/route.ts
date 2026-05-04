import { NextResponse } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const commentId = context.params.id;
    const { comment } = await req.json();

    // Read JWT directly (same pattern as comment/add)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: "authjs.session-token",
    });

    // Resolve MongoDB user ID: prefer token.userId, fall back to email lookup
    let userId = token?.userId as string | undefined;
    if (!userId && token?.email) {
      const dbUser = await dataBasePrisma.user.findUnique({
        where: { email: token.email as string },
        select: { id: true },
      });
      userId = dbUser?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be signed in to reply." },
        { status: 401 }
      );
    }

    // Find the parent comment to build parentId chain
    const parentComment = await dataBasePrisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!parentComment) {
      return NextResponse.json({ success: false, message: "Comment not found." }, { status: 404 });
    }

    // Get the original commenter's username for ReplyUserName
    const parentUserDet = await dataBasePrisma.user.findUnique({
      where: { id: parentComment.UserId },
      select: { username: true },
    });

    // Get the replying user's details
    const usr = await dataBasePrisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, image: true, name: true },
    });

    const parentIds = [...(parentComment.parentId ?? []), commentId];

    const res = await dataBasePrisma.comment.create({
      data: {
        comment,
        parentId: { set: parentIds },
        UserId: userId,
        UserName: usr?.username ?? (token?.name as string) ?? "",
        UserImage: usr?.image ?? null,
        ReplyUserName: parentUserDet?.username ?? "",
        name: usr?.name ?? (token?.name as string) ?? "",
      },
    });

    // Increment repliesCount on the direct parent
    await dataBasePrisma.comment.update({
      where: { id: commentId },
      data: { repliesCount: { increment: 1 } },
    });

    return NextResponse.json(
      { success: true, message: "Reply added successfully", data: res },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADD REPLY]", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}