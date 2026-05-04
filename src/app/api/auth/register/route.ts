import { NextRequest, NextResponse } from "next/server";
import { dataBasePrisma } from "@/databasePrisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, image } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await dataBasePrisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate username from email
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    let username = baseUsername;
    let suffix = 1;
    while (await dataBasePrisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${suffix++}`;
    }

    // Create user
    const user = await dataBasePrisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: image || null,
        username,
        role: UserRole.USER,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please sign in.",
        data: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
