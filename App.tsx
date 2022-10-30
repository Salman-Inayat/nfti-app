import { Center, NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import { useStore } from "./store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppScreen from "./screens";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/home";

const queryClient = new QueryClient();
LogBox.ignoreLogs(["Warning: ..."]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SafeAreaProvider>
        <NativeBaseProvider>
          <AppScreen />
          {/* <NavigationContainer>
            <HomeScreen />
          </NavigationContainer> */}
        </NativeBaseProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
