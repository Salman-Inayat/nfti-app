import React from "react";
import { useStore } from "../../store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";

import NFTs from "./NFTs";
import OwnNFTs from "./ownNFTs";
import CreateNFT from "./createNFT";
import About from "./about";
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
            // <MaterialIcons name="add-circle" size={60} color={primaryColor} />
            <AntDesign name="pluscircle" size={50} color={primaryColor} />
          );
        case "About":
          return (
            // <MaterialIcons
            //   name="menu"
            //   size={30}
            //   color={focused ? primaryColor : color}
            // />
            <Feather
              name="menu"
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
      <Tab.Screen name="Profile" component={Profile} options={headerOptions} />
      <Tab.Screen name="About" component={About} options={headerOptions} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
