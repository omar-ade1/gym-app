import { prisma } from "@/app/utils/prismaClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { z } from "zod";
import { checkAdminToken } from "@/app/utils/checkAdminToken";

/*
 * Method : GET
 * Url : /api/allSubscribers/${id}
 * Private : Private
 */

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    // Get Subscriber And Check If He Is Founded Or Not
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        subscriptionInfo: true,
      },
    });
    if (!subscriber) {
      return NextResponse.json({ message: "لا يوجد مشترك بهذا ال id" }, { status: 404 });
    }

    // Get The Hash Token From Subscriber And Check It
    const hashTokenFromPlayer = subscriber?.qrCode as string;
    if (!hashTokenFromPlayer) {
      return NextResponse.json({ message: "لم يتم العثور على ال token الخاص باللاعب" }, { status: 404 });
    }

    // Get Secret Key And Check It
    const secretKey = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
    if (!secretKey) {
      return NextResponse.json({ message: "رمز الامان غير موجود" }, { status: 500 });
    }

    // Get The Hash Token From Url And Check If Equel To Hash Token From Player
    const hashTokenFromUrl = request.nextUrl.searchParams.get("token") as string;

    // ? . Replace(/ / G, "+") This For That The Hashtokenfromurl Has A Space Between Some Letters And The Hash Token From Subscriber Has + Not Space

    if (hashTokenFromUrl.replace(/ /g, "+") !== hashTokenFromPlayer) {
      return NextResponse.json({ message: "رمز الامان غير متطابق" }, { status: 400 });
    }

    // Interface For Jwt Info
    interface jwtPlayerInfo {
      id: number;
      name: string;
      tel: string;
      secureKey: string;
    }

    // The Text Of Token From Player
    const tokenTextFromPlayer = subscriber.token;

    // Check If Hash Token From Url Is Equel To Token From User By Orgon2
    if (await argon2.verify(hashTokenFromUrl.replace(/ /g, "+"), tokenTextFromPlayer)) {
      // Decoded The Jwt
      const jwtVerify = jwt.verify(tokenTextFromPlayer, secretKey) as jwtPlayerInfo;

      // Generate The Password Of Player
      const passwordPlayer = `${process.env.SECURE_KEY_FOR_QR_CODE}_${subscriber.id}`;

      // Check The Password From Jwt Is Equel To The Password In .env
      if (await argon2.verify(jwtVerify.secureKey, passwordPlayer)) {
        return NextResponse.json(subscriber, { status: 200 });
      } else {
        return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/*
 * Method : PUT
 * Url : /api/allSubscribers/${id}?token=${token}
 * Private : Private
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {

    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    // Get Subscriber And Check If He Is Founded Or Not
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    if (!subscriber) {
      return NextResponse.json({ message: "لا يوجد مشترك بهذا ال id" }, { status: 404 });
    }

    // Get The Hash Token From Subscriber And Check It
    const hashTokenFromPlayer = subscriber?.qrCode as string;
    if (!hashTokenFromPlayer) {
      return NextResponse.json({ message: "لم يتم العثور على ال token الخاص باللاعب" }, { status: 404 });
    }

    // Get Secret Key And Check It
    const secretKey = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
    if (!secretKey) {
      return NextResponse.json({ message: "رمز الامان غير موجود" }, { status: 500 });
    }

    // Get The Hash Token From Url And Check If Equel To Hash Token From Player
    const hashTokenFromUrl = request.nextUrl.searchParams.get("token") as string;
    if (!hashTokenFromUrl) {
      return NextResponse.json({ message: "ال token غير موجود في ال url" }, { status: 404 });
    }

    // ? . Replace(/ / G, "+") This For That The Hashtokenfromurl Has A Space Between Some Letters And The Hash Token From Subscriber Has + Not Space

    if (hashTokenFromUrl.replace(/ /g, "+") !== hashTokenFromPlayer) {
      return NextResponse.json({ message: "الرمز المميز غير صالح" }, { status: 404 });
    }

    // Interface For Jwt Info
    interface jwtPlayerInfo {
      id: number;
      name: string;
      tel: string;
      secureKey: string;
    }

    // The Text Of Token From Player
    const tokenTextFromPlayer = subscriber.token;

    // Check If Hash Token From Url Is Equel To Token From User By Orgon2
    if (await argon2.verify(hashTokenFromUrl.replace(/ /g, "+"), tokenTextFromPlayer)) {
      // Decoded The Jwt
      const jwtVerify = jwt.verify(tokenTextFromPlayer, secretKey) as jwtPlayerInfo;

      // Generate The Password Of Player
      const passwordPlayer = `${process.env.SECURE_KEY_FOR_QR_CODE}_${subscriber.id}`;

      // Check The Password Of Player
      if (await argon2.verify(jwtVerify.secureKey, passwordPlayer)) {
        // Interface For Body
        interface Body {
          name: string;
          job: string;
          address: string;
          tel: string;
          subStart: string;
          subDuration: number;
          subEnd: string;
          imageUrl: string;
          subscriptionId: number;
          sessionsUpdate: number;
        }

        const body: Body = await request.json();

        // Create A Scehma To Check The Inputs
        const bodyScehma = z.object({
          name: z
            .string()
            .min(1, "قم بكتابة اسم المشترك")
            .min(2, "لا يمكن ان يقل اسم المشترك عن حرفين")
            .max(40, "لا يمكن ان يزيد اسم المشترك عن 40 حرف")
            .optional(),
          job: z
            .string()
            .min(1, "قم بكتابة الوظيفة")
            .min(2, "لا يمكن ان يقل اسم الوظيفة عن حرفين")
            .max(30, "لا يمكن ان يزيد اسم الوظيفة عن 30 حرف")
            .optional(),
          address: z
            .string()
            .min(1, "قم بكتابة عنوان المشترك")
            .min(2, "لا يمكن ان يقل العنوان عن حرفين")
            .max(50, "لا يمكن ان يزيد العنوان عن 50 حرف")
            .optional(),
          tel: z
            .string()
            .startsWith("01", "يجب ان يبدأ رقم الهاتف ب 01")
            .min(1, "قم بكتابة رقم هاتف المشترك")
            .min(11, "لا يمكن ان يقل رقم الهاتف عن 11 رقم")
            .max(11, "لا يمكن ان يزيد رقم الهاتف عن 11 رقم")
            .refine((val) => !isNaN(Number(val)), {
              message: "رقم الهاتف غير صالح",
            })
            .optional(),
          subStart: z.string().min(1, "قم بتحديد تاريخ بدأ الاشتراك").optional(),
          subDuration: z.number({ message: "قم باختيار مدة الاشتراك قيم صحيحة" }).min(1, "قم بتحديد مدة الاشتراك").optional(),
          subEnd: z.string().min(1, "تاريخ الانتهاء غير موجود").optional(),
          subscriptionId: z.number().min(1, "ادخل مدة الاشتراك").optional(),
          sessionsUpdate: z.number().min(1, "ادخل قيمة الحضور").optional(),
        });

        // Checking The Scehma
        const vaildation = bodyScehma.safeParse(body);
        if (!vaildation.success) {
          return NextResponse.json({ message: vaildation.error?.errors[0].message }, { status: 400 });
        }

        // Secure Keys
        const secureKeyJwtQr = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
        const secureKeyQr = process.env.SECURE_KEY_FOR_QR_CODE as string;

        // Check Secure Keys
        if (!secureKeyJwtQr) {
          return NextResponse.json({ message: "رمز امان ال Token غير موجود" }, { status: 500 });
        }

        if (!secureKeyQr) {
          return NextResponse.json({ message: "رمز امان اللاعب غير موجود" }, { status: 500 });
        }

        let subscriptionData: {
          id: number;
          duration: number;
          typeOfDuration: string;
          name: string;
          price: number;
        } | null;
        console.log(body.subscriptionId);
        if (body.subscriptionId) {
          // Get The Subscription Data Of This Subscriber And Check It To Set The Number Of Sessions
          subscriptionData = await prisma.subscriptionInfo.findUnique({
            where: {
              id: body.subscriptionId,
            },
          });

          if (!subscriptionData) {
            return NextResponse.json({ message: "لا يوجد اشتراك بهذا ال Id" }, { status: 400 });
          }
        }

        const handleUpdateSessions = () => {
          if (body.sessionsUpdate) {
            return String(parseInt(subscriber.remainingSessions) - 1);
          } else {
            if (subscriptionData?.typeOfDuration == "day") {
              return String(body.subDuration * 1);
            } else {
              return String(body.subDuration * 30);
            }
          }
        };

        const updateSubscriber = await prisma.subscriber.update({
          where: {
            id: parseInt(params.id),
          },
          data: {
            name: body.name,
            job: body.job,
            address: body.address,
            tel: body.tel,
            subStart: body.subStart,
            subEnd: body.subEnd,
            subDuration: String(body.subDuration),
            // remainingSessions: String(subscriptionData?.typeOfDuration == "day" ? String(body.subDuration * 1) : String(body.subDuration * 30)),
            remainingSessions: handleUpdateSessions(),
            // remainingSessions: String(subscriptionData?.typeOfDuration == "day" ? String((body.subDuration * 1) - body.sessionsUpdate) : String((body.subDuration * 30) - body.sessionsUpdate)),
            subscriptionInfoId: body.subscriptionId,
          },
        });

        return NextResponse.json(updateSubscriber, { status: 200 });
      } else {
        return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/*
 * Method : DELETE
 * Url : /api/allSubscribers/${id}?token=${token}
 * Private : Private
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    // Get Subscriber And Check If He Is Founded Or Not
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    if (!subscriber) {
      return NextResponse.json({ message: "لا يوجد مشترك بهذا ال id" }, { status: 404 });
    }

    // Get The Hash Token From Subscriber And Check It
    const hashTokenFromPlayer = subscriber?.qrCode as string;
    if (!hashTokenFromPlayer) {
      return NextResponse.json({ message: "لم يتم العثور على ال token الخاص باللاعب" }, { status: 404 });
    }

    // Get Secret Key And Check It
    const secretKey = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
    if (!secretKey) {
      return NextResponse.json({ message: "رمز الامان غير موجود" }, { status: 500 });
    }

    const hashTokenFromUrl = request.nextUrl.searchParams.get("token") as string;

    if (!hashTokenFromUrl) {
      return NextResponse.json({ message: "ال token غير موجود في ال url" }, { status: 404 });
    }

    // Get The Hash Token From Url And Check If Equel To Hash Token From Player
    // ? . Replace(/ / G, "+") This For That The Hashtokenfromurl Has A Space Between Some Letters And The Hash Token From Subscriber Has + Not Space
    if (hashTokenFromUrl.replace(/ /g, "+") !== hashTokenFromPlayer) {
      return NextResponse.json({ message: "الرمز المميز غير صالح" }, { status: 404 });
    }

    // Interface For Jwt Info
    interface jwtPlayerInfo {
      id: number;
      name: string;
      tel: string;
      secureKey: string;
    }

    // The Text Of Token From Player
    const tokenTextFromPlayer = subscriber.token;

    // Check If Hash Token From Url Is Equel To Token From User By Orgon2
    if (await argon2.verify(hashTokenFromUrl.replace(/ /g, "+"), tokenTextFromPlayer)) {
      // Decoded The Jwt
      const jwtVerify = jwt.verify(tokenTextFromPlayer, secretKey) as jwtPlayerInfo;

      // Generate The Password Of Player
      const passwordPlayer = `${process.env.SECURE_KEY_FOR_QR_CODE}_${subscriber.id}`;

      // Check The Password From Jwt Is Equel To The Password In .env
      if (await argon2.verify(jwtVerify.secureKey, passwordPlayer)) {
        // Secure Keys
        const secureKeyJwtQr = process.env.SECURE_KEY_FOR_JWT_QR_CODE as string;
        const secureKeyQr = process.env.SECURE_KEY_FOR_QR_CODE as string;

        // Check Secure Keys
        if (!secureKeyJwtQr) {
          return NextResponse.json({ message: "رمز امان ال Token غير موجود" }, { status: 500 });
        }

        if (!secureKeyQr) {
          return NextResponse.json({ message: "رمز امان اللاعب غير موجود" }, { status: 500 });
        }

        // todo
        const deleteSubscriber = await prisma.subscriber.delete({
          where: {
            id: parseInt(params.id),
          },
        });

        return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "كلمة السر غير متطابقة" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "ال token غير صحيح" }, { status: 400 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
