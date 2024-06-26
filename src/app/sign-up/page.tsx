import React from "react";
import signInImage from "../../../public/sign-in.svg";
import TitleAuth from "../components/signAndLogin/TitleAuth";
import ImageAuth from "../components/signAndLogin/ImageAuth";
import FormAuth from "../components/signAndLogin/FormAuth";
import { CREATE_NEW_USER } from "../fetchApi/sign-up/signUp";

const SignUp = () => {

  return (
    <div className={`py-[30px] dark:bg-zinc-900 bg-zinc-200`}>
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
