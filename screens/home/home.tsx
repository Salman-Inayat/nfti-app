import { Text, Button } from "native-base";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utils/axiosInstance";
import { useStore } from "../../store";
import { ethers } from "ethers";
const Home = () => {
  const { connector, provider, signer } = useStore();

  console.log(connector);
  console.log(provider);
  console.log(signer);

  const getData = () => {
    // axiosInstance
    //   .get("/user/get-account-balance")
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    provider.getBalance(connector._accounts[0]).then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(balance);
      console.log(`balance: ${balanceInEth} ETH`);
    });
  };

  return <Button onPress={() => getData()}>Homddsfde</Button>;
};

export default Home;
