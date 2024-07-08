import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { prisma } from "@/app/utils/prismaClient";
import { checkAdminToken } from "@/app/utils/checkAdminToken";

export async function GET(request: NextRequest) {
  try {
    
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    // Get The Subscriber Hash Token From Url And Check It
    const hashTokenFromUrl = request.nextUrl.searchParams.get("token") as string;
    if (!hashTokenFromUrl) {
      return NextResponse.json({ message: "الرمز المميز غير موجود في الرابط" }, { status: 400 });
    }

    // Get The Subscriber From Database By Qr Code Filed And Check It
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        qrCode: hashTokenFromUrl.replace(/ /g, "+"),
      },
      include: {
        subscriptionInfo : true
      }
    });
    if (!subscriber) {
      return NextResponse.json({ message: "لا يوجد مشترك بهذا الكود" }, { status: 404 });
    }

    // Get Secret Key From .env To Check The Qr Token And Check It
    const secretKey = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
    if (!secretKey) {
      return NextResponse.json({ message: "رمز الامان غير موجود" }, { status: 500 });
    }

    // The Text Of Token
    const tokenTextFromPlayer = subscriber.token;

    if (await argon2.verify(hashTokenFromUrl.replace(/ /g, "+"), tokenTextFromPlayer)) {
      // Jwt Interface For Player Info
      interface jwtPlayerInfo {
        id: number;
        name: string;
        tel: string;
        secureKey: string;
      }

      // Decoded Player Jwt And Check It
      let jwtVerifyPlayer: jwtPlayerInfo;
      try {
        jwtVerifyPlayer = jwt.verify(tokenTextFromPlayer, secretKey) as jwtPlayerInfo;
      } catch (err) {
        return NextResponse.json({ message: "الرمز المميز غير صحيح" }, { status: 400 });
      }

      // Get Secert Key Qr Player From .env And Check It
      const secretKeyQrPlayer = process.env.SECURE_KEY_FOR_QR_CODE as string;
      if (!secretKeyQrPlayer) {
        return NextResponse.json({ message: "رمز الامان غير موجود" }, { status: 500 });
      }

      // Generate The Password Of Player
      const secertPassForPlayer = `${secretKeyQrPlayer}_${jwtVerifyPlayer.id}`;

      // Check The Password If Equal To The Password From Token
      const isPasswordValid = await argon2.verify(jwtVerifyPlayer.secureKey, secertPassForPlayer);

      if (!isPasswordValid) {
        return NextResponse.json({ message: "كلمة السر غير متطابقة" }, { status: 400 });
      }

      // Get The Token Qr From Player And Check It
      const hashTokenFromPlayer = subscriber?.qrCode as string;

      if (!hashTokenFromPlayer) {
        return NextResponse.json({ message: "لم يتم العثور على ال token الخاص باللاعب" }, { status: 404 });
      }

      // ? . Replace(/ / G, "+") This For That The Hashtokenfromurl Has A Space Between Some Letters And The Hash Token From Subscriber Has + Not Space
      if (hashTokenFromUrl.replace(/ /g, "+") !== hashTokenFromPlayer) {
        return NextResponse.json({ message: "رمز الامان غير متطابق" }, { status: 400 });
      }

      // Return The Subscriber
      return NextResponse.json(subscriber, { status: 200 });
    } else {
      return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
