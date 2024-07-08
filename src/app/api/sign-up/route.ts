import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import { generateCookie, generateToken } from "@/app/utils/generateToken";
import { jwtPayLoad } from "@/app/utils/interfaces";
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
      image: string;
    }

    const body: Body = await request.json();

    // Roles For Inputs
    const bodyScehma = z.object({
      userName: z
        .string()
        .min(1, "يرجى كتابة اسم المستخدم")
        .min(3, "اسم المستخدم يجب ان يكون بين ال 3 أحرف الى 30 حرف كحد اقصى")
        .max(30, "اسم المستخدم يجب ان يكون بين ال 3 أحرف الى 30 حرف كحد اقصى"),
      email: z.string().min(1, "يرجى كتابة الإيميل").min(1, "هذا الحقل مطلوب").email("الايميل غير صحيح"),
      password: z.string().min(1, "يرجى كتابة كلمة السر").min(6, "يجب ان تكون كلمة السر على الاقل 6 أحرف"),
      image: z
        .string()
        .min(1, "من فضلك قم بتحميل صورة لك")
        .url("عنوان الصورة غير صالح")
        .startsWith("https://res.cloudinary.com/dwcgyuogy/image/upload/"),
    });

    // Checking
    const vaildation = bodyScehma.safeParse(body);
    if (!vaildation.success) {
      return NextResponse.json({ message: vaildation.error.errors[0].message }, { status: 400 });
    }

    // Check If This Email Is Exists Or Not
    const checkEmail = await prisma.user.findUnique({ where: { email: body.email } });
    if (checkEmail) {
      return NextResponse.json({ message: "خطأ في الإيميل أو كلمة السر" }, { status: 400 });
    }

    // Hashing The Password
    const Passwordhash = await argon2.hash(body.password);

    // Create Account
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        userName: body.userName,
        password: Passwordhash,
        image: body.image,
      },
    });

    // This For Jwt Payload For Generate Token
    const jwtPayLoad: jwtPayLoad = {
      email: newUser.email,
      userName: newUser.userName,
      image: newUser.image,
    };

    // Generate Token And Cookie
    const cookie = generateCookie(jwtPayLoad) as string;

    if (!cookie) {
      return NextResponse.json({ message: "مفتاح التوقيع السري غير معرف" }, { status: 500 });
    }

    // Return The Success Message
    return NextResponse.json({ message: "تم إنشاء حساب بنجاح" }, { status: 200, headers: { "Set-Cookie": cookie } });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}
