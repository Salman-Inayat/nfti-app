import { NativeBaseProvider } from "native-base";

import AuthScreen from "./screens/auth";
import HomeScreen from "./screens/home";
import ConnectWalletScreen from "./screens/onboarding/connectWallet";

import { useStore } from "./store";

import { StatusBar } from "expo-status-bar";

import AppScreen from "./screens";

const App = () => {
  const { isLoggedIn, hasWalletConnected } = useStore();

  return (
    <NativeBaseProvider>
      {/* {isLoggedIn ? (
        <AuthScreen />
      ) : hasWalletConnected ? (
        <HomeScreen />
      ) : (
        <ConnectWalletScreen />
      )}
      <StatusBar /> */}
      <AppScreen />
    </NativeBaseProvider>
  );
};

export default App;
