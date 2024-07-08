import axios, { AxiosResponse } from "axios";

export const LOGIN = async (email: string, password: string) => {
  try {
    const res: AxiosResponse = await axios.post("/api/login", {
      email: email,
      password: password,
    });
    return res;
  } catch (error) {
    return error;
  }
};
