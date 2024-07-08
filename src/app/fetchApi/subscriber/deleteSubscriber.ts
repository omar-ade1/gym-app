import { DOMAIN_NAME } from "@/app/utils/domainName";
import axios from "axios";

export const DELETE_SUBSCRIBER = async (id: number, token: string) => {
  try {
    const res = await axios.delete(`${DOMAIN_NAME}/api/allSubscribers/${id}?token=${token}`);
    return res;
  } catch (error) {
    return error;
  }
};
