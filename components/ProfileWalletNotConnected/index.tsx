import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  Box,
  Center,
  Text,
  VStack,
  Image,
  useDisclose,
  Button,
  Heading,
} from "native-base";
import React, { useEffect } from "react";
import useConnectWallet from "../../hooks/useConnectWallet";

function ProfileWalletNotConnected() {
  const { connectWallet } = useConnectWallet();

  return (
    <Center safeArea height="100%" w="100%" p={10}>
      <Box>
        <VStack
          space={10}
          alignItems="center"
          justifyContent="space-between"
          h="70%"
        >
          <Heading size="md">Log into your wallet</Heading>
          <Image
            size={130}
            source={require("../../assets/images/Wallet_Image.png")}
            alt="Alternate Text"
            resizeMode="contain"
          />

          <Text fontSize="md" textAlign="center">
            Connect to any WalletConnect supported wallet to buy and sell NFTs
            on NFTI
          </Text>
          <Button onPress={connectWallet} w="100%" borderRadius={50}>
            Connect Wallet
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default ProfileWalletNotConnected;
