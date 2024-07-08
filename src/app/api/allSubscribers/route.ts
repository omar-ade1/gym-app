import { checkAdminToken } from "@/app/utils/checkAdminToken";
import { prisma } from "@/app/utils/prismaClient";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : Get
 * Url : /api/allSubscribers
 * Private : Private
 */
export async function GET(request: NextRequest) {
  try {
    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    // Return Data
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
      id : "desc"
    } });
    return NextResponse.json(subscribers, { status: 200 });

    // While Error
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
