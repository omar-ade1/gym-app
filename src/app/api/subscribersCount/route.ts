import { checkAdminToken } from "@/app/utils/checkAdminToken";
import { prisma } from "@/app/utils/prismaClient";
import { ROW_IN_PAGE } from "@/app/utils/rowsPerPage";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/*
 * Method : Get
 * Url : /api/subscribersCount
 * Private : Private
 */

export async function GET(request: NextRequest) {
  try {

    // Get The Token And Check It
    const token = checkAdminToken();
    if (typeof token !== "string") {
      return token; // سيعيد الرسالة الخطأ إذا لم يتم العثور على التوكن
    }

    const searchText = request.nextUrl.searchParams.get("searchText") || "";
    const searchBy = request.nextUrl.searchParams.get("searchBy") || "name";

    if (searchBy == "id") {
      const subscribers = await prisma.subscriber.count({
        where: {
          [searchBy]: parseInt(searchText),
        },
      });

      return NextResponse.json(subscribers, { status: 200 });
    } else {
      const subscribers = await prisma.subscriber.count({
        where: {
          [searchBy]: {
            contains: searchText,
          },
        },
      });
      return NextResponse.json(subscribers, { status: 200 });
    }

 
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
