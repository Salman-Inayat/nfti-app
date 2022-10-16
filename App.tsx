import { NativeBaseProvider } from "native-base";

import AuthScreen from "./screens/auth";
import HomeScreen from "./screens/home";
import ConnectWalletScreen from "./screens/onboarding/connectWallet";

import { useStore } from "./store";

import { StatusBar } from "expo-status-bar";

import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import AppScreen from "./screens";

const App = () => {
  const { isLoggedIn, hasWalletConnected } = useStore();

  return (
    <NativeBaseProvider>
      <AppScreen />
    </NativeBaseProvider>
  );
};

export default App;
