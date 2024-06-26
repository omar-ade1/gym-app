"use client" 
import { Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";

interface Props {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isVisible: boolean;
  toggleVisibility: () => void;
}

const InputPassword: React.FC<Props> = ({ password, setPassword, isVisible, toggleVisibility }) => {
  return (
    <Input
      label="كلمة السر"
      variant="faded"
      required
      isRequired
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.div key={"show"} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                <IoEye className="text-2xl text-default-400 pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div key={"hide"} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="w-[400px] block max-w-full mt-5"
    />
  );
};

export default InputPassword;
