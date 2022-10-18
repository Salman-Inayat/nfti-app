import React from "react";
import { IconButton, Icon } from "native-base";
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
    // headerMode: "none",
    // navigationOptions: {
    //   headerVisible: false,
    // },
    // headerTintColor: primaryColor,
    // headerStyle: { backgroundColor: "transparent", width: 300 },
    headerTitleAlign: "center",
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
