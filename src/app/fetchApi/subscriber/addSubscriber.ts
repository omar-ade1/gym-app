import axios from "axios";

export const ADD_SUBSCRIBER = async (
  name: string,
  job: string,
  address: string,
  tel: string,
  subStart: string,
  subDuration: string,
  subEnd: string,
  imageUrl?: string,
  subscriptionId?: number
) => {
  try {
    const res = await axios.post("/api/subscribers", {
      name: name,
      job: job,
      address: address,
      tel: tel,
      subStart: subStart,
      subDuration: subDuration,
      subEnd: subEnd,
      imageUrl: imageUrl,
      subscriptionId,
    });
    return res;
  } catch (error) {
    return error;
  }
};
