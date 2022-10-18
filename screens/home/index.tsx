import React from "react";
import { Text, Container, IconButton, Icon } from "native-base";
import { useStore } from "../../store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import NFTs from "./NFTs";
import OwnNFTs from "./ownNFTs";
import CreateNFT from "./createNFT";
import Transactions from "./transactions";
import Profile from "./profile";
import { primaryColor } from "../../theme/colors";

const HomeScreen = ({ navigation }) => {
  const { logout } = useStore();

  const Tab = createBottomTabNavigator();

  const headerOptions = {
    // headerTintColor: primaryColor,
    headerStyle: { backgroundColor: "transparent" },
    headerTitleAlign: "center",
  };

  const screenOptions = ({ route }) => ({
    tabBarStyle: { height: 60 },
    tabBarIcon: ({ color, size, focused }) => {
      switch (route.name) {
        case "NFTs":
          return (
            <MaterialCommunityIcons
              name="home"
              size={30}
              color={focused ? primaryColor : color}
            />
          );

        case "Own":
          return (
            <MaterialCommunityIcons
              name="bag-personal"
              size={30}
              color={focused ? primaryColor : color}
            />
          );
        case "Create":
          return (
            <MaterialIcons name="add-circle" size={60} color={primaryColor} />
          );
        case "Transactions":
          return (
            <MaterialIcons
              name="person"
              size={30}
              color={focused ? primaryColor : color}
            />
          );
        case "Profile":
          return (
            <MaterialIcons
              name="person"
              size={30}
              color={focused ? primaryColor : color}
            />
          );

        default:
          break;
      }
    },
    tabBarShowLabel: false,
    tabBarInactiveTintColor: "gray",
    tabBarActiveTintColor: "blue",
    cardStyle: {
      backgroundColor: "red",
    },
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
