import React from "react";
import { Text, Container, IconButton, Icon } from "native-base";
import { useStore } from "../../store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import NFTs from "./NFTs";
import OwnNFTs from "./ownNFTs";
import CreateNFT from "./createNFT";
import Transactions from "./transactions";
import Profile from "./profile";

const HomeScreen = ({ navigation }) => {
  const { logout } = useStore();

  const Tab = createBottomTabNavigator();

  const headerOptions = {
    headerRight: () => (
      <IconButton
        icon={<Icon as={MaterialIcons} name="logout" />}
        onPress={() => {
          logout(navigation);
        }}
      />
    ),
  };

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      switch (route.name) {
        case "NFTs":
          return (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          );

        case "Own":
          return (
            <MaterialCommunityIcons
              name="bag-personal"
              size={size}
              color={color}
            />
          );
        case "Create":
          return <MaterialIcons name="add-circle" size={size} color={color} />;
        case "Transactions":
          return <MaterialIcons name="person" size={size} color={color} />;
        case "Profile":
          return <MaterialIcons name="person" size={size} color={color} />;

        default:
          break;
      }
    },
    tabBarInactiveTintColor: "gray",
    tabBarActiveTintColor: "blue",
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="NFTs"
        component={NFTs}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Own" component={OwnNFTs} options={headerOptions} />
      <Tab.Screen name="Create" component={CreateNFT} options={headerOptions} />
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={headerOptions}
      />
      <Tab.Screen name="Profile" component={Profile} options={headerOptions} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
