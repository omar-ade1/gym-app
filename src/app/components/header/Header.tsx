"use client";

import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./header.css";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import NavLScreen from "./components/NavLScreen";
import NavSmScreen from "./components/NavSmScreen";

interface dataToken {
  email: string;
  userName: string;
  image: string;
}

interface Props {
  token: string | undefined;
  verfiyToken: dataToken | undefined;
}

const Header: React.FC<Props> = ({ verfiyToken, token }) => {
  // This For Check The Menu Is Open Or Not And It's Boolean
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // This For Check The Media Of Width And It's Boolean
  const [mediaQuery, setMediaQuery] = useState<boolean>(false);

  const pathname = usePathname();

  // This For Check If Screen Width Is Equal To 1023px Or Not
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setMediaQuery(window.matchMedia("(max-width: 1023px)").matches);
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // This For Close Menu If Screen Width Upper Than 767px
  useEffect(() => {
    if (!mediaQuery) {
      setIsMenuOpen(false);
    }
  }, [mediaQuery]);

  // Hide The Scroll When The Menu Is Open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  // Close Menu Function
  const closeMenu = () => setIsMenuOpen(false);

  // Close The Menu When The Url Is Changed
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div>
      <header
        className={`h-[66px] w-full p-2 flex items-center justify-center fixed mdT0:border-b  ${
          isMenuOpen ? "bg-zinc-300" : "bg-zinc-300"
        } cursor-pointer !z-50 dark:bg-zinc-800 dark:border-b-zinc-700`}
      >
        <div className="container flex items-center justify-around mdT0:justify-between relative z-30">
          <Logo isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} closeMenu={closeMenu} />

          <NavLScreen pathname={pathname} />

          <NavSmScreen token={token} isMenuOpen={isMenuOpen} pathname={pathname} />

          {!token ? (
            <div className="auth flex items-center gap-2 xxsm:hidden">
              <Button as={Link} href="/login" color="primary" variant="solid">
                تسجيل الدخول
              </Button>
              <Button as={Link} href="/sign-up" color="primary" variant="ghost">
                انشاء حساب
              </Button>
            </div>
          ) : (
            <Avatar as={Link} href={"/profile"} className="xxsm:hidden" isBordered color="default" src={verfiyToken?.image} />
          )}

          {/* icon for small screen */}
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isMenuOpen ? "menuOpen" : "menuClose"} icon hidden xxsm:!flex items-center`}>
            {token && <Avatar as={Link} href={"/profile"} className="xxsm:block hidden" isBordered color="default" src={verfiyToken?.image} />}
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
        </div>
      </header>
    </div>
  );
};

export default Header;
