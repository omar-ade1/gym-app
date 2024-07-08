import { DOMAIN_NAME } from "@/app/utils/domainName";
import { prisma } from "@/app/utils/prismaClient";
import { ROW_IN_PAGE } from "@/app/utils/rowsPerPage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { checkAdminToken } from "@/app/utils/checkAdminToken";

/*
 * Method : Get
 * Url : /api/subscribers
 * Private : Private
 */
export async function GET(request: NextRequest) {
  try {
    
    // Get The Token And Check It
    const token = checkAdminToken()
    if (typeof token !== 'string') {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const searchText = request.nextUrl.searchParams.get("searchText") || "";
    const searchBy = request.nextUrl.searchParams.get("searchBy") || "name";

    if (searchBy == "id") {
      // Check The Type Of Input
      const shcemaId = z.string().refine((val) => !isNaN(Number(val)), {
        message: "قم بإدخال رقم و ليس نص في البحث ب ID",
      });
      const validation = shcemaId.safeParse(searchText);
      if (!validation.success) {
        return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
      }

      // Return Data
      const subscribers = await prisma.subscriber.findMany({
        where: {
          [searchBy]: parseInt(searchText),
        },
        take: ROW_IN_PAGE,
        skip: ROW_IN_PAGE * (parseInt(pageNumber) - 1),
      });
      return NextResponse.json(subscribers, { status: 200 });
    } else {
      if (searchBy == "tel") {
        // Check The Type Of Input
        const shcemaTel = z
          .string()
          .min(1, "قم بكتابة رقم هاتف المشترك")
          .max(11, "لا يمكن ان يزيد رقم الهاتف عن 11 رقم")
          .refine((val) => !isNaN(Number(val)), {
            message: "رقم الهاتف غير صالح",
          });
        const validation = shcemaTel.safeParse(searchText);
        if (!validation.success) {
          return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
        }
      }

      // Return Data
      const subscribers = await prisma.subscriber.findMany({
        where: {
          [searchBy]: {
            contains: searchText,
          },
        },

        include: {
          subscriptionInfo: true,
        },

        orderBy: {
          id: "desc",
        },
        take: ROW_IN_PAGE,
        skip: ROW_IN_PAGE * (parseInt(pageNumber) - 1),
      });
      return NextResponse.json(subscribers, { status: 200 });
    }

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/*
 * Method : Post
 * Url : /api/subscribers
 * Private : Private
 */

export async function POST(request: NextRequest) {
  try {
    // Get The Token And Check It
    const token: string | undefined = cookies().get("jwtToken")?.value as string;

    if (!token) {
      return NextResponse.json({ message: "من فضلك قم بتسجيل الدخول للتأكد من هويتك" }, { status: 400 });
    }

    // Interface For Body
    interface Body {
      name: string;
      job: string;
      address: string;
      tel: string;
      subStart: string;
      subDuration: string;
      subEnd: string;
      imageUrl?: string;
      subscriptionId: number;
    }

    const body: Body = await request.json();

    // Create A Scehma To Check The Inputs
    const bodyScehma = z.object({
      name: z.string().min(1, "قم بكتابة اسم المشترك").min(2, "لا يمكن ان يقل اسم المشترك عن حرفين").max(40, "لا يمكن ان يزيد اسم المشترك عن 40 حرف"),
      job: z.string().min(1, "قم بكتابة الوظيفة").min(2, "لا يمكن ان يقل اسم الوظيفة عن حرفين").max(30, "لا يمكن ان يزيد اسم الوظيفة عن 30 حرف"),
      address: z.string().min(1, "قم بكتابة عنوان المشترك").min(2, "لا يمكن ان يقل العنوان عن حرفين").max(50, "لا يمكن ان يزيد العنوان عن 50 حرف"),
      tel: z
        .string()
        .startsWith("01", "يجب ان يبدأ رقم الهاتف ب 01")
        .min(1, "قم بكتابة رقم هاتف المشترك")
        .min(11, "لا يمكن ان يقل رقم الهاتف عن 11 رقم")
        .max(11, "لا يمكن ان يزيد رقم الهاتف عن 11 رقم")
        .refine((val) => !isNaN(Number(val)), {
          message: "رقم الهاتف غير صالح",
        }),
      subStart: z.string().min(1, "قم بتحديد تاريخ بدأ الاشتراك"),
      subDuration: z.string().min(1, "قم بتحديد مدة الاشتراك"),
      subEnd: z.string().min(1, "تاريخ الانتهاء غير موجود"),
      imageUrl: z
        .string()
        .min(1, "قم بالتقاط صورة للمشترك")
        .url("عنوان الصورة غير صالح")
        .startsWith("https://res.cloudinary.com/dwcgyuogy/image/upload/", "عنوان الصورة غير صالح")
        .optional(),
      subscriptionId: z.number().min(1, "ادخل مدة الاشتراك"),
    });

    // Checking The Scehma
    const vaildation = bodyScehma.safeParse(body);
    if (!vaildation.success) {
      return NextResponse.json({ message: vaildation.error?.errors[0].message }, { status: 400 });
    }

    // Create A New Subscriber
    const newSubscriber = await prisma.subscriber.create({
      data: {
        name: body.name,
        job: body.job,
        address: body.address,
        tel: body.tel,
        subStart: body.subStart,
        subDuration: body.subDuration,
        remainingSessions: "",
        subEnd: body.subEnd,
        imageUrl: body.imageUrl || "",
        qrCode: "",
        token: "",
        subscriptionInfoId: body.subscriptionId,
      },
    });

    const secretKey = process.env.JWT_SECRET_KEY;

    // Return Null If No Private Key
    if (!secretKey) {
      return NextResponse.json({ message: "المفتاح السري غير موجود" }, { status: 500 });
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

    // Hash The Secure Key Qr And Some Of User Information
    // const hashSecureKeyQr = await argon2.hash(`${secureKeyQr}_${newSubscriber.id}_${newSubscriber.name}_${newSubscriber.tel}_`);
    const hashSecureKeyQr = await argon2.hash(`${secureKeyQr}_${newSubscriber.id}`);

    const jwtPayLoad = {
      id: newSubscriber.id,
      name: newSubscriber.name,
      tel: newSubscriber.tel,
      secureKey: hashSecureKeyQr,
    };

    // Generate Token
    const tokenQr = jwt.sign(jwtPayLoad, secureKeyJwtQr);

    const hashToken = await argon2.hash(tokenQr);

    // Get The Subscription Data Of This Subscriber And Check It To Set The Number Of Sessions
    const subscriptionData = await prisma.subscriptionInfo.findUnique({
      where: {
        id: newSubscriber.subscriptionInfoId,
      },
    });

    if (!subscriptionData) {
      return NextResponse.json({ message: "لا يوجد اشتراك بهذا ال Id" }, { status: 400 });
    }

    // update subscriber to set qrCode value with a new subscriber id
    const updateSubscriber = await prisma.subscriber.update({
      where: {
        id: newSubscriber.id,
      },
      data: {
        qrCode: `${hashToken}`,
        token: tokenQr,
        remainingSessions:
          subscriptionData.typeOfDuration == "day" ? String(parseInt(body.subDuration) * 1) : String(parseInt(body.subDuration) * 30),
      },
    });

    // Return A Successful Message
    return NextResponse.json({ message: `تم إضافة المشترك بنجاح` }, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
