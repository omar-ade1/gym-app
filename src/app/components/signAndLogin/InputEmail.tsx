"use client";
import { Input } from "@nextui-org/react";
import React from "react";

interface Props {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const InputEmail: React.FC<Props> = ({ email, setEmail }) => {
  return (
    <Input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      // required
      isRequired
      className="w-[400px] block max-w-full"
      type="email"
      variant={"faded"}
      label="الايميل"
    />
  );
};

export default InputEmail;
