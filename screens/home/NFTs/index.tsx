import React from "react";
import { IconButton, Icon } from "native-base";
import { useStore } from "../../../store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./home";
import ViewNFT from "./viewNFT";
import ResellNFT from "./resellNFT";

const NFTs = ({ navigation }) => {
  const { logout } = useStore();

  const Tab = createNativeStackNavigator();

  const headerOptions = {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false,
    },
  };

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} options={headerOptions} />
      <Tab.Screen name="ViewNFT" component={ViewNFT} options={headerOptions} />
      <Tab.Screen
        name="ResellNFT"
        component={ResellNFT}
        options={headerOptions}
      />
    </Tab.Navigator>
  );
};

export default NFTs;
