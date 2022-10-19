import {
  Container,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
} from "native-base";
import React from "react";
import { useStore } from "../../store";
import { shortenAddress } from "../../utils/walletUtils";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from "ethers";

const Profile = () => {
  const { connector, provider } = useStore();
  console.log({ connector });

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const getHistory = async () => {
    // get transction history with ethers
    let etherscanProvider = new ethers.providers.EtherscanProvider();

    const transactions = await etherscanProvider.getHistory(
      connector.accounts[0]
    );
    console.log({ transactions });
  };

  const getBalance = async () => {
    const balance = await provider.getBalance(connector.accounts[0]);

    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(`balance: ${balanceInEth} ETH`);
    return balanceInEth;
  };

  return (
    <Box px={6} safeArea w="100%">
      <Image
        size={140}
        borderRadius={100}
        source={{
          uri: "https://wallpaperaccess.com/full/317501.jpg",
        }}
        alt="Alternate Text"
      />
      <VStack space={4} py={4} px={2}>
        <HStack space={2} alignItems="center">
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <MaterialIcons
            name="content-copy"
            size={18}
            color="grey"
            onPress={() => {
              copyToClipboard(connector.accounts[0]);
            }}
          />
        </HStack>
        <Text>Wallet:</Text>
        <Button onPress={getHistory}>Get history</Button>
        <Button onPress={getBalance}>Get balance</Button>
      </VStack>
    </Box>
  );
};

export default Profile;
