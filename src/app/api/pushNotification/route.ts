import { dataBasePrisma } from "@/databasePrisma";
import { currentUser } from "@/lib/authDet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const { token, country } = await req.json();

    await dataBasePrisma.pushNotificationToken.upsert({
      where: { token }, // ✅ only unique field
      update: {
        country,
        email: user?.email,
      },
      create: {
        token,
        country,
        email: user?.email,
      },
    });

    return NextResponse.json(
      { success: true, message: "Token saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}