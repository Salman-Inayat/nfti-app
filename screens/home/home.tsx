import { Text, Button } from "native-base";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const getData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.log(result);
  };

  return <Button onPress={() => getData()}>Home</Button>;
};

export default Home;
