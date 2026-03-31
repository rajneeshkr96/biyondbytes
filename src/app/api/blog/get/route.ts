import { NextResponse,NextRequest } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const fields = req.nextUrl.searchParams.get("fields")?.split(",");
    const query: any = { }; 
    if (fields && fields.length > 0) {
      query.select = {}; // Initialize select object
  
      fields.forEach((field) => {
        if (!field.startsWith("-")) {
          query.select[field] = true; // Set each field to true for selection
        } else {
          const deselectedField = field.slice(1);
          query.select[deselectedField] = false; // Deselect the field
        }
      });
    }
    const blog = await dataBasePrisma.blog.findMany({
      ...query
    })
    const length = blog.length
    return NextResponse.json({ success: true,message:"fetched successfully",length:length, data: blog }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false,message:error }, { status: 500 });
  }
}
