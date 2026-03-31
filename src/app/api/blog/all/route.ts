import { NextResponse, NextRequest } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";
export const dynamic = "force-dynamic"; 
async function validateQueryParams(req: NextRequest) {
  const url = req.nextUrl;
  const allowedParams = ["page", "limit", "sort", "fields", "search", "tags"]; // Include 'search' and 'tags'
  const invalidParams = Object.keys(url.searchParams).filter(
    (param) => !allowedParams.includes(param)
  );

  if (invalidParams.length > 0) {
    throw new Error(`Invalid query parameters: ${invalidParams.join(", ")}`);
  }

  // Validate page and limit (if provided)
  const page = parseInt(url.searchParams.get("page") || "1");
  if (isNaN(page) || page < 1) {
    throw new Error("Invalid page number: must be a positive integer");
  }

  const limit = parseInt(url.searchParams.get("limit") || "12");
  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new Error(
      "Invalid limit: must be a positive integer between 1 and 100"
    );
  }

  return { page, limit };
}

async function getBlogs(id:string,page: number, limit: number, sort?: string, fields?: string[], search?: string, tags?: string[]) {
  const query: any = { }; // Create empty query object
    if (search) {
      query.where = {
          OR: [
              { title: { contains: search } },
              { content: { contains: search } },
              { tags: { hasSome: [search] } },
              // Add more search fields as needed (e.g., author, tags)
          ],
      };
  }
  if (search === "" && tags && tags.length > 0) {
    query.where = {
      ...query.where,
      tags: { // Assuming 'tags' is a relation in the blog model
        hasSome: tags, // Filter blogs where 'tags' has some of the specified tags
      },
    };
  }

  if (sort) {
    const sortFields = sort.split(",").map((field) => {
      const order = field.startsWith("-") ? "desc" : "asc";
      const fieldName = order === "desc" ? field.slice(1) : field;
      return { [fieldName]: order };
    });
    query.orderBy = sortFields;
  }



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
  if(id !== "undefined" && id !== ""){
    query.select.likes = {
      where:{
        UserId: id,
      },
      select:{
       like: true
      }
    }
    ,
    query.select.bookmarks={
      where:{
        UserId: id,
      },
      select:{
        bookmark: true
      }
    }
  }

  const skip = (page - 1) * limit; // Calculate skip for pagination
  const blogs = await dataBasePrisma.blog.findMany({
    take: limit, // Limit results
    skip, // Skip results for pagination
    ...query 
  });

  return blogs;
}


export async function GET(req: NextRequest) {
  try {
    const { page, limit } = await validateQueryParams(req);
    const sort = req.nextUrl.searchParams.get("sort") ?? "";
    const fields = req.nextUrl.searchParams.get("fields")?.split(",");
    const search = req.nextUrl.searchParams.get("search") ?? "";
    const tags = req.nextUrl.searchParams.get("tags")?.split(",");
    const userId = req.nextUrl.searchParams.get("id") ?? "";
    let blogs = await getBlogs(userId,page, limit, sort, fields,search,tags);
    const total = await dataBasePrisma.blog.count(); // Count all blogs
    return NextResponse.json(
      { success: true, message: "Fetched successfully", data: blogs, total },
      { status: 200 }
    );
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
