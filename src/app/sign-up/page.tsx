import React from "react";
import signInImage from "../../../public/sign-in.svg";
import TitleAuth from "../components/signAndLogin/TitleAuth";
import ImageAuth from "../components/signAndLogin/ImageAuth";
import FormAuth from "../components/signAndLogin/FormAuth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface dataToken {
  email: string;
  userName: string;
  image: string;
}

const SignUp = () => {
  const token: string = cookies().get("jwtToken")?.value as string;
  const key: string = process.env.JWT_SECRET_KEY as string;
  const check = () => {
    if (!token) {
      return null;
    }
    const varfiyToken = jwt.verify(token, key) as dataToken ;
    return varfiyToken;
  };
  if (token) {
    redirect("/");
  }
  check()

  return (
    <div className={`py-[30px]  light:bg-zinc-200`}>
      <div className=" page-height container flex flex-col items-center justify-center">
        <TitleAuth titleText={`إنشاء حساب`} />

        <div className="flex xmdT0:flex-col justify-evenly w-full items-center">
          <ImageAuth ImageData={signInImage} />

          <FormAuth login={false} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
