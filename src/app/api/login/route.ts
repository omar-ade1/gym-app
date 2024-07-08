import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as argon2 from "argon2";
import { User, jwtPayLoad } from "@/app/utils/interfaces";
import { generateCookie } from "@/app/utils/generateToken";

/*
 * Method : Post
 * Url : /api/Login
 * Private : public
 */

export async function POST(request: NextRequest) {
  try {
    interface Body {
      email: string;
      password: string;
    }
    const body: Body = await request.json();

    // Roles For Inputs
    const bodyScehma = z.object({
      email: z.string().min(1, "يرجى كتابة الإيميل").min(1, "هذا الحقل مطلوب").email("الايميل غير صحيح"),
      password: z.string().min(1, "يرجى كتابة كلمة السر").min(6, "يجب ان تكون كلمة السر على الاقل 6 أحرف"),
    });

    // Checking
    const vaildation = bodyScehma.safeParse(body);
    if (!vaildation.success) {
      return NextResponse.json({ message: vaildation.error.errors[0].message }, { status: 400 });
    }

    const user = (await prisma.user.findUnique({ where: { email: body.email } })) as User;

    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 400 });
    }

    const isPasswordValid = await argon2.verify(user.password, body.password);

    if (isPasswordValid) {
      // This For Jwt Payload For Generate Token
      const jwtPayLoad: jwtPayLoad = {
        email: user.email,
        userName: user.userName,
        image: user.image,
      };

      // Generate Token And Cookie
      const cookie = generateCookie(jwtPayLoad) as string;

      if (!cookie) {
        return NextResponse.json({ message: "مفتاح التوقيع السري غير معرف" }, { status: 500 });
      }

      return NextResponse.json({ message: "تم تسجيل الدخول بنجاح" }, { status: 200, headers: { "Set-Cookie": cookie } });
    } else {
      return NextResponse.json({ message: "خطأ في كلمة السر أو الإيميل" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "خطأ في السيرفر" }, { status: 500 });
  }
}
