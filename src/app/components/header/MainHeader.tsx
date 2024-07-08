import React from "react";
import Header from "./Header";
import { cookies } from "next/headers";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces";



const MainHeader = () => {
  const token: string | undefined = cookies().get("jwtToken")?.value as string;


  const verfiyToken = tokenInfo() as jwtPayLoad

  return (
    <div>
      <Header verfiyToken={verfiyToken} token={token} />
    </div>
  );
};

export default MainHeader;
