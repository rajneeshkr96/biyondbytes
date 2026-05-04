import { NextRequest, NextResponse } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }
    const user = await dataBasePrisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return NextResponse.json({
      exists: !!user,
    });
  } catch (error) {
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
