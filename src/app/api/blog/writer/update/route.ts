import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import readingTime from 'reading-time';

export async function PUT(req: NextRequest) {
  try {
    const { slug, title, image, content, metaTitle, metaDesc } = await req.json();

    // Read JWT directly — more reliable than auth() in Route Handlers
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: "authjs.session-token",
    });

    // Resolve MongoDB user ID
    let userId = token?.userId as string | undefined;
    if (!userId && token?.email) {
      const dbUser = await dataBasePrisma.user.findUnique({
        where: { email: token.email as string },
        select: { id: true },
      });
      userId = dbUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const readTime = readingTime(content).text;

    // Use updateMany or find first to ensure ownership
    const blog = await dataBasePrisma.blog.findUnique({
      where: { slug: slug },
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    if (blog.authorId !== userId) {
      return NextResponse.json({ success: false, message: "You are not the author of this blog." }, { status: 403 });
    }

    const updatedBlog = await dataBasePrisma.blog.update({
      where: { slug: slug },
      data: {
        title,
        image,
        content,
        metaTitle,
        metaDesc,
        readTime,
      },
    });

    return NextResponse.json({ success: true, message: "Blog updated successfully", data: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("[UPDATE BLOG]", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}