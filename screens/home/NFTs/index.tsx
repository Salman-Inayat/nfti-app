import React from "react";
import { IconButton, Icon, Button, Image, HStack, Text } from "native-base";
import { useStore } from "../../../store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./home";
import ViewNFT from "./viewNFT";
import ResellNFT from "./resellNFT";
import { primaryColor } from "../../../theme/colors";

const NFTs = ({ navigation }) => {
  const { logout } = useStore();

  const Tab = createNativeStackNavigator();

  const headerOptions = {
    headerTitleAlign: "center",
  };

  const homeHeaderOptions = {
    // remove default header name
    headerTitle: "",
    headerLeft: () => (
      <HStack space={2} alignItems="center" ml={2}>
        <Image
          source={require("../../../assets/images/NFT-logo.png")}
          alt="logo"
          size="xs"
        />
        <Text fontSize="lg" fontWeight="bold">
          NftyCart
        </Text>
      </HStack>
    ),
  };

  const viewNFTOptions = ({ route }) => ({
    title: route.params.name,
    headerTitleAlign: "center",
  });

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={homeHeaderOptions} />
      <Tab.Screen name="ViewNFT" component={ViewNFT} options={viewNFTOptions} />
      <Tab.Screen
        name="ResellNFT"
        component={ResellNFT}
        options={headerOptions}
      />
    </Tab.Navigator>
  );
};

export default NFTs;
