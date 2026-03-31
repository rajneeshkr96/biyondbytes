// update blog 

import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest,NextResponse } from "next/server";
import { currentRole, currentUserId } from "@/lib/authDet";
import readingTime from 'reading-time';
import { BlogPops } from "../create/route";

interface Blog extends BlogPops{
  slug: string;
}

export async function PUT(request: NextRequest) {
  try {
    const {slug,title,image,content,metaTitle,metaDesc}:Blog = await request.json();
    const authorId = await currentUserId() || "65e6de30136474657e223231";
    console.log(authorId)
    const readTime = readingTime(content).text;
    const blog = await dataBasePrisma.blog.update({
      where: {
        slug: slug,
        authorId: authorId
      },
      data: {
        title: title,
        image: image,
        content: content,
        metaTitle: metaTitle,
        metaDesc: metaDesc,
        readTime: readTime,
      },
    });
    return NextResponse.json({ success: true, message: "Blog updated successfully", data: blog }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}