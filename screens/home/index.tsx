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
import { Icon, IconButton, useDisclose } from "native-base";
import LogoutActionSheet from "../../components/LogoutActionSheet";
import { Alert } from "react-native";

const HomeScreen = ({ navigation }) => {
  const { logout, connector } = useStore();
  const { isOpen, onOpen, onClose } = useDisclose();

  const Tab = createBottomTabNavigator();

  const handleLogout = () => {
    connector.killSession();
    logout();
  };

  const headerOptions = {
    // headerTintColor: primaryColor,
    headerStyle: { backgroundColor: "transparent" },
    headerTitleAlign: "center",
    headerRight: () => {
      return (
        connector?.connected && (
          <>
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="logout"
                  size={30}
                  onPress={() => {
                    Alert.alert("", "Are you sure you want to logout?", [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Logout",
                        onPress: () => handleLogout(),
                        style: "destructive",
                      },
                    ]);
                  }}
                />
              }
            />
          </>
        )
      );
    },
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
          return <AntDesign name="pluscircle" size={50} color={primaryColor} />;
        case "About":
          return (
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
      {/* <LogoutActionSheet onClose={onClose} isOpen={isOpen} onOpen={onOpen} /> */}
    </Tab.Navigator>
  );
};

export default HomeScreen;
