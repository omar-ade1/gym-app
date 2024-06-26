import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";

/*
 * Method : Post
 * Url : /api/sign-up
 * Private : public
 */

export async function POST(request: NextRequest) {
  try {
    // InterFace For Body
    interface Body {
      email: string;
      userName: string;
      password: string;
    }

    const body: Body = await request.json();

    // Roles For Inputs
    const bodyScehma = z.object({
      email: z.string().email("Email Is Not Available"),
      userName: z.string().min(3, "User name must be between 3 and 10 letters").max(30, "User name must be between 3 and 10 letters"),
      password: z.string().min(6, "Password Must Be At Least 6 Letters"),
    });

    // Checking
    const vaildation = bodyScehma.safeParse(body);
    if (!vaildation.success) {
      return NextResponse.json({ message: vaildation.error.errors[0].message }, { status: 400 });
    }

    // Check If This Email Is Exists Or Not
    const checkEmail = await prisma.user.findUnique({ where: { email: body.email } });
    if (checkEmail) {
      return NextResponse.json({ message: "Invalid Password Or Email" }, { status: 400 });
    }

    // Hashing The Password
    const Passwordhash = await argon2.hash("password");

    // Create Account
    await prisma.user.create({
      data: {
        email: body.email,
        userName: body.userName,
        password: Passwordhash,
      },
    });

    // Return The Success Message
    return NextResponse.json({ message: "Create Account Successful" }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
