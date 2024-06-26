"use client";
import Link from "next/link";
import React from "react";
import { CgGym } from "react-icons/cg";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeMenu: () => void;
}

const Logo: React.FC<Props> = ({ isMenuOpen, setIsMenuOpen, closeMenu }) => {
  return (
    <div className="logo flex items-center ">
      {/* icon for large screen */}
      <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isMenuOpen ? "menuOpen" : "menuClose"} icon hidden mdT0:block xxsm:!hidden`}>
        <label className="hamburger">
          <svg viewBox="0 0 32 32">
            <path
              className={`line ${isMenuOpen ? "dark:stroke-red-600" : "dark:stroke-white"}  line-top-bottom`}
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            ></path>
            <path className={`line ${isMenuOpen ? "dark:stroke-red-600" : "dark:stroke-white"}`} d="M7 16 27 16"></path>
          </svg>
        </label>
      </div>

      <Link onClick={closeMenu} href={"/"} className="select-none">
        <h1 dir="ltr" className={` text-2xl font-bold flex items-center`}>
          Fitness
          <CgGym className="text-2xl" />
          Gym
        </h1>
      </Link>
    </div>
  );
};

export default Logo;
