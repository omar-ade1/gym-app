import { checkAdminToken } from "@/app/utils/checkAdminToken";
import { prisma } from "@/app/utils/prismaClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : GET
 * Url : /api/subscriptionInfo
 * Private : Private
 */

export async function GET(request: NextRequest) {
  try {
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token;
    }

    const subscriptionInfo = await prisma.subscriptionInfo.findMany({
      include: {
        subscribers: true,
      },
    });
    return NextResponse.json(subscriptionInfo, { status: 200 });

    // While Error
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}

/*
 * Method : POST
 * Url : /api/subscriptionInfo
 * Private : Private
 */

export async function POST(request: NextRequest) {
  try {
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    interface Body {
      duration: number;
      name: string;
      price: number;
      typeOfDuration: string;
    }

    const body: Body = await request.json();

    const checkSubscription = await prisma.subscriptionInfo.findFirst({
      where: {
        AND: [
          {
            duration: body.duration,
          },
          {
            typeOfDuration: body.typeOfDuration,
          },
          {
            name: body.name.trim(),
          },
        ],
      },
    });
    if (checkSubscription) {
      return NextResponse.json({ message: "هذا الاشتراك موجود بالفعل" }, { status: 400 });
    }

    const subscriptionInfo = await prisma.subscriptionInfo.create({
      data: {
        duration: body.duration,
        name: body.name,
        price: body.price,
        typeOfDuration: body.typeOfDuration,
      },
    });

    return NextResponse.json({ message: "تم الاضافة بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
