import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./home";
import AuthScreen from "./auth";
import ConnectWalletScreen from "./onboarding/connectWallet";

const AppScreen = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ConnectWallet"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dashboard" component={HomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ConnectWallet" component={ConnectWalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppScreen;
