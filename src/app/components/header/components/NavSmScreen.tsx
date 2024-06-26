import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/react";

const variantNav = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const variantUl = {
  hidden: {
    opacity: 1,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const variantLink = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};

interface Props {
  isMenuOpen: boolean;
  pathname: string;
}

const NavSmScreen: React.FC<Props> = ({ isMenuOpen, pathname }) => {
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.nav variants={variantNav} initial="hidden" animate="show" exit="exit" className="hidden mdT0:block">
          <motion.ul
            variants={variantUl}
            className={`grid grid-cols-2 place-items-center fixed top-[66px] w-screen right-0 h-[calc(100vh-66px)] ul-background text-white text-2xl font-bold`}
          >
            <motion.li variants={variantLink} className=" w-full h-full">
              <Link
                className={`link-header transition-hover flex justify-center items-center w-full h-full border-l border-b border-[#323232] rounded-xl ${
                  pathname == "/" ? "bg-[#0070BB]" : ""
                }`}
                href={"/"}
              >
                الرئيسية
              </Link>
            </motion.li>
            <motion.li variants={variantLink} className=" w-full h-full">
              <Link
                className={`link-header transition-hover flex justify-center items-center w-full h-full border-b border-[#323232] rounded-xl ${
                  pathname == "/admin" ? "bg-[#0070BB]" : ""
                }`}
                href={"#"}
              >
                الادمن
              </Link>
            </motion.li>
            <motion.li variants={variantLink} className=" w-full h-full">
              <Link
                className={`link-header transition-hover flex justify-center items-center w-full h-full border-l border-b border-[#323232] rounded-xl ${
                  pathname == "/fsljkeflk" ? "bg-[#0070BB]" : ""
                }`}
                href={"#"}
              >
                المبيعات
              </Link>
            </motion.li>
            <motion.li variants={variantLink} className="w-full h-full">
              <Link
                className={`link-header transition-hover flex justify-center items-center w-full h-full border-b border-[#323232] rounded-xl ${
                  pathname == "/members" ? "bg-[#0070BB]" : ""
                }`}
                href={"#"}
              >
                الاعضاء
              </Link>
            </motion.li>
            <motion.li variants={variantLink} className="w-full h-full">
              <Link
                className={`link-header transition-hover flex justify-center items-center w-full h-full border-l border-[#323232] rounded-xl ${
                  pathname == "/sub" ? "bg-[#0070BB]" : ""
                }`}
                href={"#"}
              >
                الاشتراكات
              </Link>
            </motion.li>
            <motion.li variants={variantLink} className="hidden xxsm:flex flex-col space-y-3">
              <Button className="w-full flex justify-center items-center" as={Link} href="/login" color="primary" variant="solid">
                تسجيل الدخول
              </Button>
              <Button className="w-full flex justify-center items-center" as={Link} href="/sign-up" color="primary" variant="ghost">
                انشاء حساب
              </Button>
            </motion.li>
          </motion.ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavSmScreen;
