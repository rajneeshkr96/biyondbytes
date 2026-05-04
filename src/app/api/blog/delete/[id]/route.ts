import { NextRequest, NextResponse } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";
import { getToken } from "next-auth/jwt";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Read JWT directly — more reliable than auth() in Route Handlers
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
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    const blog = await dataBasePrisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Strict ownership check
    if (blog.authorId !== userId) {
      return NextResponse.json(
        { success: false, message: "You are not the author of this blog." },
        { status: 403 }
      );
    }

    // Delete related records first (MongoDB doesn't cascade automatically in this setup)
    await dataBasePrisma.like.deleteMany({ where: { BlogId: id } });
    await dataBasePrisma.bookmarks.deleteMany({ where: { BlogId: id } });
    await dataBasePrisma.notifications.deleteMany({ where: { BlogId: id } });
    
    // Delete comments and their likes
    const comments = await dataBasePrisma.comment.findMany({ where: { BlogId: id }, select: { id: true } });
    const commentIds = comments.map((c) => c.id);
    if (commentIds.length > 0) {
      await dataBasePrisma.commentLikes.deleteMany({ where: { CommentId: { in: commentIds } } });
    }
    await dataBasePrisma.comment.deleteMany({ where: { BlogId: id } });

    await dataBasePrisma.blog.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE BLOG]", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
