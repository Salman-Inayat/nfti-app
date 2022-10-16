import { NativeBaseProvider } from "native-base";

import { useStore } from "./store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppScreen from "./screens";

const queryClient = new QueryClient();

const App = () => {
  const { isLoggedIn, hasWalletConnected } = useStore();

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <NativeBaseProvider>
        <AppScreen />
      </NativeBaseProvider>
    </QueryClientProvider>
  );
};

export default App;
