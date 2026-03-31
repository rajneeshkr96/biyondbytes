import { dataBasePrisma } from "@/databasePrisma";
import { currentUser } from "@/lib/authDet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
<<<<<<< HEAD
  try {
    const user = await currentUser();
    const { token, country } = await req.json();
=======
    
    try {
        const email = await currentUser();
        const { token } = await req.json();
        const isExist = await dataBasePrisma.pushNotificationToken.findUnique(
            {
                where: { token:token},
              }
        );
        if (!isExist) {
            
            await dataBasePrisma.pushNotificationToken.create({data:{
                token: token,
                email: email?.email
            }});
        }
        return NextResponse.json({ success: true, message: "Token saved successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error }, { status: 500 });
>>>>>>> 1c2bb8282f848a0e1a546894118970c45713fd78

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