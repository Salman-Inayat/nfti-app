import create from "zustand";

interface Store {
  isLoggedIn: boolean;
  walletData: any;
  connector: any;
  provider: any;
  signer: any;
  logout: () => void;
  setUserWalletConnection: (data: any) => void;
}
export const useStore = create<Store>((set) => ({
  // token: null,
  isLoggedIn: false,
  // loginError: null,
  // signUpError: null,
  // userId: null,
  // hasWalletConnected: false,
  walletData: null,
  connector: null,
  provider: null,
  signer: null,
  // signUp: async (data: any) => {
  //   try {
  //     const res = await axiosInstance.post("/auth/register", data);
  //     if (res.data.error) {
  //       console.log("Error: ", res.data.error);
  //       Object.entries(errors).forEach(([key, value]) => {
  //         if (value === res.data.error.message) {
  //           set({ signUpError: res.data.error.message });
  //         }
  //       });
  //     } else {
  //       const userData = res.data.user;
  //       set({ isLoggedIn: true, userId: userData._id });
  //       await setItemInAsyncStorage("token", res.data.token);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  // signIn: async (data: any, navigation) => {
  //   try {
  //     const res = await axiosInstance.post("/auth/login", data);

  //     if (res.data.error) {
  //       Object.entries(errors).forEach(([key, value]) => {
  //         if (value === res.data.error.message) {
  //           set({ loginError: res.data.error.message });
  //         }
  //       });
  //     } else {
  //       const userData = res.data.user;

  //       set({ isLoggedIn: true, userId: res.data.user._id });
  //       await setItemInAsyncStorage("token", res.data.token);

  //       if (!userData.wallet) {
  //         set({ hasWalletConnected: false });
  //         navigation.navigate("ConnectWallet");
  //       } else {
  //         set({ hasWalletConnected: true, walletData: userData.wallet });
  //         navigation.navigate("Dashboard", {
  //           screen: "NFTs",
  //           params: {
  //             screen: "Home",
  //           },
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  // login: async (navigation) => {
  //   set({
  //     isLoggedIn: true,
  //   });
  // },
  logout: async () => {
    set({
      isLoggedIn: false,
      provider: null,
      signer: null,

      walletData: null,
    });
  },
  // attachWallet: async (data: any, navigation) => {
  //   try {
  //     console.log("Data: ", data);
  //     const res = await axiosInstance.post("/auth/attach-wallet", data);

  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  // detachWallet: async () => {
  //   try {
  //     const res = await axiosInstance.delete("/auth/detach-wallet");
  //     await removeItemFromAsyncStorage(
  //       "@walletconnect/qrcode-modal-react-native:session"
  //     );
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  // getUserData: async () => {
  //   try {
  //     const res = await axiosInstance.get("/auth/get-user-data");
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  // uploadNFT: async (data: any) => {
  //   try {
  //     console.log({ data });
  //     const res = await axiosInstance.post("/nft/upload", data, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  setUserWalletConnection: async (data: {
    connector: any;
    provider: any;
    signer: any;
  }) => {
    const { connector, provider, signer } = data;
    set({
      connector,
      provider,
      signer,
      isLoggedIn: true,
    });
  },
}));
