"use client";
import React, { FormEvent, useState } from "react";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import SubmitBtn from "./SubmitBtn";
import InputUserName from "./InputUserName";
import { CREATE_NEW_USER } from "@/app/fetchApi/sign-up/signUp";

interface Props {
  login: boolean;
}

const FormAuth: React.FC<Props> = ({ login }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSign = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const message = await CREATE_NEW_USER(email,userName,password)
    console.log(message);
  }

  return (
    <form onSubmit={(e) => handleSign(e) } className="w-[400px] max-w-full shadow-xl p-5 rounded-xl border-t dark:border-t-gray-800 dark:bg-zinc-800">
      {!login && <InputUserName userName={userName} setUserName={setUserName} />}
      <InputEmail email={email} setEmail={setEmail} />

      <InputPassword password={password} setPassword={setPassword} isVisible={isVisible} toggleVisibility={toggleVisibility} />

      <SubmitBtn btnText={`تسجيل`} />
    </form>
  );
};

export default FormAuth;
