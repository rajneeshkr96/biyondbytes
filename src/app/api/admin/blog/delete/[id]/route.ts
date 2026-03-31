// delete blog 
import { dataBasePrisma } from "@/databasePrisma";
import { NextRequest,NextResponse } from "next/server";

export async function DELETE(request: NextRequest,context:{params:{id:string}}) {
  try {
    const { id } = context.params;
    const blog = await dataBasePrisma.blog.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true, message: "Blog deleted successfully", data: blog }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
}