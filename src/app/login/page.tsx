import React from "react";
import loginImage from "../../../public/login.svg";
import TitleAuth from "../components/signAndLogin/TitleAuth";
import ImageAuth from "../components/signAndLogin/ImageAuth";
import FormAuth from "../components/signAndLogin/FormAuth";

const Login = () => {
  return (
    <div className={`py-[30px] dark:bg-zinc-900 bg-zinc-200`}>
      <div className=" page-height container flex flex-col items-center justify-center">
        <TitleAuth titleText={`تسجيل الدخول`} />

        <div className="flex xmdT0:flex-col justify-evenly w-full items-center">
          <ImageAuth ImageData={loginImage} />

          <FormAuth login={true} />
        </div>
      </div>
    </div>
  );
};

export default Login;
