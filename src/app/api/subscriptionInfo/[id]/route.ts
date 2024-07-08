import { checkAdminToken } from "@/app/utils/checkAdminToken";
import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : DELETE
 * Url : /api/subscriptionInfo/${id}
 * Private : Private
 */

export async function DELETE(request: NextRequest, { params }:any) {
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

    const checkSubscription = await prisma.subscriptionInfo.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        subscribers: true,
      },
    });

    if (!checkSubscription) {
      return NextResponse.json({ message: "لم يتم العثور على هذا الاشتراك" }, { status: 400 });
    }

    if (checkSubscription.subscribers.length) {
      return NextResponse.json({ message: `لا يمكن حذف هذا الاشتراك لان هناك ${checkSubscription.subscribers.length} مشترك فيه` }, { status: 400 });
    }

    const deleteSubscription = await prisma.subscriptionInfo.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: "تم الحذف بنجاح" }, { status: 200 });

    // While Error
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
