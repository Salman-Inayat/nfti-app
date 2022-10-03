import create from "zustand";
import axiosInstance from "../utils/axiosInstance";
import persist from "../utils/zustandPersist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import errors from "../constants/errors";
import { setItemInAsyncStorage } from "../utils/handleAsyncStorage";

export const useStore = create((set) => ({
  token: null,
  isLoggedIn: false,
  loginError: null,
  signUpError: null,
  userId: null,
  signUp: async (data: any) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      console.log("Response: " + res);
      if (res.data.error) {
        console.log("Error: ", res.data.error);
        Object.entries(errors).forEach(([key, value]) => {
          if (value === res.data.error.message) {
            set({ signUpError: res.data.error.message });
          }
        });
        await setItemInAsyncStorage("token", res.data.token);
      } else {
        set({ isLoggedIn: true });
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  },
  signIn: async (data: any) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.data.error) {
        Object.entries(errors).forEach(([key, value]) => {
          if (value === res.data.error.message) {
            set({ loginError: res.data.error.message });
          }
        });
      } else {
        set({ isLoggedIn: true });
        console.log(res.data);
        await AsyncStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      console.error(err);
    }
  },
  logout: async () => {
    set({ isLoggedIn: false });
    setItemInAsyncStorage("token", "");
  },
  attachWallet: async (data: any) => {
    try {
      console.log("Data: ", data);
      const res = await axiosInstance.post("/auth/attach-wallet", data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  },
}));
