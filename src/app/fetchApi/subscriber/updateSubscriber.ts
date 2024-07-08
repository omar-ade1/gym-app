import axios from "axios";

export const UPDATE_SUBSCRIBER = async (
  id: string,
  token: string,
  name?: string,
  job?: string,
  address?: string,
  tel?: string,
  subStart?: string,
  subDuration?: number,
  subEnd?: string,
  subscriptionId?: number,
  sessionsUpdate?: number
) => {
  try {
    const res = await axios.put(`/api/allSubscribers/${id}?token=${token}`, {
      name: name,
      job: job,
      address: address,
      tel: tel,
      subStart: subStart,
      subDuration: subDuration,
      subEnd: subEnd,
      subscriptionId: subscriptionId,
      sessionsUpdate: sessionsUpdate,
    });
    console.log(subscriptionId);

    return res;
  } catch (error) {
    return error;
  }
};
