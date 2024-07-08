import axios, { AxiosError, AxiosResponse } from "axios";

export const CREATE_NEW_USER = async (
  email: string,
  userName: string,
  password: string,
  image: string
): Promise<AxiosResponse<any> | AxiosError<any>> => {
  try {
    const res: AxiosResponse = await axios.post("/api/sign-up", {
      userName: userName,
      email: email,
      password: password,
      image: image,
    });

    return res;
  } catch (error: any) {
    return error;
  }
};
