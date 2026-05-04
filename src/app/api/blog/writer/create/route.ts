import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import readingTime from 'reading-time';

const generateSlug = async (title: string) => {
  const baseSlug = title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .join("-")
    .toLowerCase();

  const existing = await dataBasePrisma.blog.findUnique({
    where: { slug: baseSlug },
  });

  if (existing) {
    return `${baseSlug}-${new Date().getTime()}`;
  }
  return baseSlug;
};

export async function POST(req: NextRequest) {
  try {
    const { title, tags, image, content, metaTitle, metaDesc } = await req.json();

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
    const slug = await generateSlug(title);

    const blog = await dataBasePrisma.blog.create({
      data: {
        title,
        tags,
        image,
        content,
        metaTitle,
        metaDesc,
        authorId: userId,
        readTime,
        slug,
      },
    });

    return NextResponse.json({ success: true, message: "Blog created successfully", data: blog }, { status: 201 });
  } catch (error) {
    console.error("[CREATE BLOG]", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
