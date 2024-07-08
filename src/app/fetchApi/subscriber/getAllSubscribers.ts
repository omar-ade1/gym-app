import axios from "axios";

export const GET_ALL_SUBSCRIBER = async (page:number,searchText:string,searchBy:string) => {
  try {
    const res = await axios.get(`/api/subscribers?pageNumber=${page}&searchText=${searchText}&searchBy=${searchBy}`);
    return res;
  } catch (error) {
    return error;
  }
};  
