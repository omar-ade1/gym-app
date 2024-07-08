import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { jwtPayLoad } from "./interfaces";

export const tokenInfo = () => {

  const token = cookies().get("jwtToken")?.value as string
  
  if (!token) {
    return null
  }

  const privateKey = process.env.JWT_SECRET_KEY
  if (!privateKey) {
      return null
    }
  
  const dataFromToken = jwt.verify(token, privateKey) as jwtPayLoad

  return dataFromToken
  
}