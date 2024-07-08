import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function checkAdminToken() {
  // Get The Token And Check It
  const token: string | undefined = cookies().get("jwtToken")?.value as string;
  if (!token) {
    return NextResponse.json({ message: "من فضلك قم بتسجيل الدخول للتأكد من هويتك" }, { status: 400 });
  }
  return token
}
