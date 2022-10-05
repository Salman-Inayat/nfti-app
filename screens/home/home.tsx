import { Text, Button } from "native-base";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utils/axiosInstance";
const Home = () => {
  // const getData = async () => {
  //   const keys = await AsyncStorage.getAllKeys();
  //   const result = await AsyncStorage.multiGet(keys);
  //   console.log(result);
  // };

  const getData = () => {
    axiosInstance
      .get("/user/get-account-balance")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return <Button onPress={() => getData()}>Homddsfde</Button>;
};

export default Home;
