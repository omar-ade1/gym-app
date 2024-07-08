import axios from "axios";

export const GET_SUBSCRIBER_COUNT = async (searchText:string,searchBy:string) => {
  try {
    const res = await axios.get(`/api/subscribersCount?searchText=${searchText}&searchBy=${searchBy}`)
    return res
  } catch (error) {
    return error
  }
};
