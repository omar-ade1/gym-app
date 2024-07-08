import jwt from "jsonwebtoken";
import { jwtPayLoad } from "./interfaces";
import { serialize } from "cookie";

// Generate Token
export const generateToken = (jwtPayLoad: jwtPayLoad) => {

  // Get A Private Key From .env
  const secretKey = process.env.JWT_SECRET_KEY;

  // Return Null If No Private Key
  if (!secretKey) {
    return null;
  }

  // Generate Token
  const token = jwt.sign(jwtPayLoad, secretKey, {
    expiresIn: "30d",
  });

  return token;
};


// Generate Cookie
export const generateCookie = (jwtPayLoad: jwtPayLoad) => {
  
  // Token
  const token = generateToken(jwtPayLoad) as string;

  if (!token) return null;

  // Geneate Cookie
  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return cookie;
};
