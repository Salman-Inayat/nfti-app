// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// import useCachedResources from "./hooks/useCachedResources";
// import useColorScheme from "./hooks/useColorScheme";
// import Navigation from "./navigation";

// export default function App() {
//   const isLoadingComplete = useCachedResources();
//   const colorScheme = useColorScheme();

//   if (!isLoadingComplete) {
//     return null;
//   } else {
//     return (
//       <SafeAreaProvider>
//         <Navigation colorScheme={colorScheme} />
//         <StatusBar />
//       </SafeAreaProvider>
//     );
//   }
// }

import { NativeBaseProvider } from "native-base";

import AuthScreen from "./screens/auth";
import HomeScreen from "./screens/home";
import { useStore } from "./store";

import { StatusBar } from "expo-status-bar";
import WalletConnectProvider from "@walletconnect/react-native-dapp"; // } //   withWalletConnect, //  {
import { Platform } from "react-native";
import { scheme } from "expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const { isLoggedIn } = useStore();

  return (
    <NativeBaseProvider>
      {/* <WalletConnectProvider
        storageOptions={{
          asyncStorage: AsyncStorage,
        }}
        redirectUrl={
          Platform.OS === "web" ? window.location.origin : `${scheme}://`
        }
      > */}
      {!isLoggedIn ? <AuthScreen /> : <HomeScreen />}
      <StatusBar />
      {/* </WalletConnectProvider> */}
    </NativeBaseProvider>
  );
};

export default App;

// export default withWalletConnect(App, {
//   storageOptions: {
//     asyncStorage: AsyncStorage,
//   },
//   redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
// });
