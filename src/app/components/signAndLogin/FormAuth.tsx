"use client";
import React, { FormEvent, useState } from "react";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import SubmitBtn from "./SubmitBtn";
import InputUserName from "./InputUserName";
import { CREATE_NEW_USER } from "@/app/fetchApi/sign-up/signUp";
import { Toast } from "@/app/utils/smAlert";
import { LOGIN } from "@/app/fetchApi/login/login";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface Props {
  login: boolean;
}

const FormAuth: React.FC<Props> = ({ login }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const [userName, setUserName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string>("");

  const router = useRouter();

  // To Show Or Hide Password
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // If This Page Is Sign In Page
    if (!login) {
      const message: any = await CREATE_NEW_USER(email, userName, password, imageUrl);

      // If Function Completed Successfuly
      if (message.request.status == 200) {
        Toast.fire({
          icon: "success",
          title: message.data.message,
        });
        router.push("/");
        router.refresh();
        // While Error
      } else {
        Toast.fire({
          icon: "error",
          title: message.response.data.message,
        });
      }

      // If This Page Is A Login Page
    } else {
      const message: any = await LOGIN(email, password);

      // If Function Completed Successfuly
      if (message.request.status == 200) {
        Toast.fire({
          icon: "success",
          title: message.data.message,
        });
        router.push("/");
        router.refresh();
        // While Error
      } else {
        Toast.fire({
          icon: "error",
          title: message.response.data.message,
        });
      }
    }
    setIsLoading(false);
  };

  // Get The Url Of Image
  const handleUploadSuccess = (result: any) => {
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
    }
  };

  return (
    <form onSubmit={(e) => handleAuth(e)} className="w-[400px] max-w-full shadow-xl p-5 rounded-xl border-t dark:border-t-gray-800 dark:bg-zinc-800">
      {!login && <InputUserName userName={userName} setUserName={setUserName} />}
      <InputEmail email={email} setEmail={setEmail} />

      <InputPassword password={password} setPassword={setPassword} isVisible={isVisible} toggleVisibility={toggleVisibility} />

      {/* fix */}
      {!login && (
        <>
          {!imageUrl && (
            <div className="mt-5">
              <CldUploadWidget
                uploadPreset="ml_default"
                options={{
                  language: "ar",
                  sources: ["camera", "local"],
                  multiple: false,
                  singleUploadAutoClose: false,
                }}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => {
                  return (
                    <Button fullWidth color="warning" type="button" onClick={() => open()}>
                      تحميل صورة
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>
          )}
        </>
      )}
      {/* fix */}
      {/* fix */}
      {imageUrl && (
        <div className="mt-5">
          <div className="w-[152px] h-[152px] mb-5 flex justify-center items-center m-auto border-2 border-blue-500 border-double rounded-full bg-blue-200">
            <Image
              className=" w-[150px] shrink-0 rounded-full object-cover object-center h-[150px] block"
              width={150}
              height={150}
              src={imageUrl}
              alt="test"
            ></Image>
          </div>
          <Button fullWidth color="danger">
            حذف الصورة و تحميل صورة اخرى
          </Button>
        </div>
      )}
      {/* fix */}

      {/* {!login && <div className="mt-5"><FileInput /></div>} */}
      <SubmitBtn loading={isLoading} btnText={`تسجيل`} />
    </form>
  );
};

export default FormAuth;
