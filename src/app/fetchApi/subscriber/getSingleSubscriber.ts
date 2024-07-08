import axios from "axios"
export const GET_SINGLE_SUBSCRIBER = async (id:string,token:string) => {
  try {
    const res = await axios.get(`/api/allSubscribers/${id}?token=${token}`)

    return res

  } catch (error) {
    return error
  }
}