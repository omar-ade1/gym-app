"use client";
import { Input } from "@nextui-org/react";
import React from "react";

interface Props {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

const InputUserName: React.FC<Props> = ({ userName, setUserName }) => {
  return (
    <Input
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      // required
      isRequired
      className="w-[400px] block max-w-full mb-5"
      type="text"
      variant={"faded"}
      label="اسم المستخدم"
    />
  );
};

export default InputUserName;
