import axios from "axios";

export const CREATE_NEW_USER = async (email:string, userName:string, password:string) => {
  try {
    const res = await axios.post("/api/sign-up", {
      email: email,
      userName: userName,
      password: password,
    });

    return res

  } catch (error) {
    return error
  }
};
