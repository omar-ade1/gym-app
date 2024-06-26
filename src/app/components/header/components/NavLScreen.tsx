import Link from "next/link";
import React from "react";

interface Props {
  pathname: string;
}

const NavLScreen: React.FC<Props> = ({ pathname }) => {
  return (
    <nav className="mdT0:hidden">
      <ul className={`flex items-center`}>
        <li>
          <Link className={`link-header transition-hover ${pathname == "/" ? "bg-[#0070BB] text-white" : ""}`} href={"/"}>
            الرئيسية
          </Link>
        </li>
        <li>
          <Link className={`link-header transition-hover ${pathname == "/dd" ? "bg-[#0070BB] text-white" : ""}`} href={"#"}>
            الادمن
          </Link>
        </li>
        <li>
          <Link className={`link-header transition-hover ${pathname == "/dd" ? "bg-[#0070BB] text-white" : ""} `} href={"#"}>
            المبيعات
          </Link>
        </li>
        <li>
          <Link className={`link-header transition-hover ${pathname == "/dd" ? "bg-[#0070BB] text-white" : ""} `} href={"#"}>
            الاعضاء
          </Link>
        </li>
        <li>
          <Link className={`link-header transition-hover ${pathname == "/dd" ? "bg-[#0070BB] text-white" : ""}`} href={"#"}>
            الاشتراكات
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLScreen;
