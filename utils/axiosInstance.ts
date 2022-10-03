import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "@env";
import { getItemFromAsyncStorage } from "./handleAsyncStorage";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
});

axiosInstance.interceptors.request.use(async (req) => {
  let token = await getItemFromAsyncStorage("token");

  if (token) req.headers!.authorization = `Bearer ${token}`;
  req.headers = {
    ...req.headers,
    "Content-Type": "application/json",
  };

  return req;
});

export default axiosInstance;
