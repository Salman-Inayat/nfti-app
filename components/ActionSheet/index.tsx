import React, { useEffect, useState } from "react";
import {
  Button,
  Actionsheet,
  useDisclose,
  Text,
  Box,
  Center,
  NativeBaseProvider,
  VStack,
  Heading,
  Divider,
  Image,
} from "native-base";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useStore } from "../../store";

const ConnectWalletActionSheet = ({ isOpen, onOpen, onClose }) => {
  const connector = useWalletConnect();
  const { setUserWalletConnection } = useStore();

  const connectWallet = async () => {
    await connector.connect();
  };

  useEffect(() => {
    if (connector.connected) {
      const walletProvider = new WalletConnectProvider({
        chainId: 5,
        infuraId: "f62aa0828a7f4e1bbee0fb73cad0388d",
        connector: connector,
        qrcode: false,
      });

      let wp = (async () => {
        return await walletProvider.enable();
      })();

      wp.then((res) => {
        const provider = new ethers.providers.Web3Provider(walletProvider);

        const signer = provider.getSigner();

        const data = {
          connector,
          provider,
          signer,
        };

        setUserWalletConnection(data);
        onClose();
      }).catch((err) => console.log(err));
    }
  }, [connector]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Box w="100%" h={300} px={4} pb={2}>
          <VStack
            alignItems="center"
            w="100%"
            height="100%"
            justifyContent="space-between"
          >
            <Heading size="md">Connect wallet</Heading>
            <Divider
              //   my="2"
              _light={{
                bg: "muted.400",
              }}
              _dark={{
                bg: "muted.50",
              }}
            />
            <VStack
              space={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Image
                size={130}
                source={require("../../assets/images/Wallet_Image.png")}
                alt="Alternate Text"
                resizeMode="contain"
              />
              <Text fontSize="sm" textAlign="center">
                Connect to any walletConnect supported wallet to buy NFTs
              </Text>
            </VStack>
            <Button
              onPress={() => connectWallet()}
              width="100%"
              size="lg"
              borderRadius={50}
            >
              Connect Wallet
            </Button>
          </VStack>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ConnectWalletActionSheet;
