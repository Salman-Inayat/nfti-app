import { NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppScreen from "./screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();
LogBox.ignoreLogs(["Warning: ..."]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SafeAreaProvider>
        <NativeBaseProvider>
          <AppScreen />
        </NativeBaseProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
