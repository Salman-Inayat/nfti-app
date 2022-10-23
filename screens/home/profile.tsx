import {
  Container,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  useToast,
  ScrollView,
  Heading,
} from "native-base";
import React, { useState } from "react";
import { useStore } from "../../store";
import * as Clipboard from "expo-clipboard";

import axios from "axios";
import ProfileWalletNotConnected from "../../components/ProfileWalletNotConnected";
import { getETHPriceInUSD, shortenAddress } from "../../utils/walletUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { primaryColor } from "../../theme/colors";
import { ethers } from "ethers";
import { ActivityIndicator } from "react-native";

const Profile = ({ navigation }) => {
  const { connector, provider, signer } = useStore();

  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState({
    inETH: null,
    inUSD: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getTransactions();
      if (connector?.connected) {
        (async () => await getWalletBalance(connector?.accounts[0]))();
      }
    }, [])
  );

  const copyToClipboard = (text: string) => {
    Clipboard?.setString(text);
    if (!toast.isActive("copied")) {
      toast.show({
        id: "copied",
        render: () => {
          return (
            <Box bg="white" px="2" py="2" rounded="md" mb={5} shadow={5}>
              Copied to clipboard
            </Box>
          );
        },
      });
    }
  };

  const getTransactions = async () => {
    setIsLoading(true);
    let data = JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          fromAddress: connector?.accounts[0],
          category: ["erc721"],
        },
      ],
    });

    var requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    const apiKey = "hBLwhx2rYMaPbySIvWmIxV0sicTQqVSz";
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    const axiosURL = `${baseURL}`;

    const response = await axios(axiosURL, requestOptions);
    const { result } = response.data;
    console.log("Result: ", result);
    setIsLoading(false);
    setTransactions(result.transfers);
  };

  if (!connector?.connected) {
    return <ProfileWalletNotConnected />;
  }

  const checkTransactionType = (transaction) => {
    if (transaction.from === connector?.accounts[0]) {
      return "Sender";
    }
    return "Receiver";
  };

  const getWalletBalance = async (address: any) => {
    const balance = await provider.getBalance(address).then();
    const balanceInEth = ethers.utils.formatEther(balance);
    const balanceInUSD = await getETHPriceInUSD(balanceInEth);
    setWalletBalance({
      inETH: balanceInEth.substring(0, 4),
      inUSD: balanceInUSD.toFixed(2),
    });
  };

  return (
    <Box py={2} w="100%" h="100%">
      <VStack space={2} h="100%">
        <Box display="flex" p={2} h="20%">
          <HStack space={2}>
            <Box
              w="40%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                size={100}
                borderRadius={100}
                source={{
                  uri: "https://wallpaperaccess.com/full/317501.jpg",
                }}
                alt="Alternate Text"
              />
            </Box>

            <VStack
              space={2}
              w="60%"
              justifyContent="center"
              alignItems="flex-start"
            >
              <HStack
                space={2}
                alignItems="center"
                bg="primary.200"
                borderRadius={50}
                px={2}
                py={1}
              >
                <Text>{shortenAddress(connector.accounts[0])}</Text>
                <MaterialIcons
                  name="content-copy"
                  size={18}
                  color={primaryColor}
                  onPress={() => {
                    copyToClipboard(connector.accounts[0]);
                  }}
                />
              </HStack>
              <VStack space={2}>
                <Heading size="lg">{walletBalance.inETH} ETH</Heading>
                <Text fontSize="sm">$ {walletBalance.inUSD}</Text>
              </VStack>
            </VStack>
          </HStack>
        </Box>
        <VStack space={4} py={4} px={6}>
          <Heading size="md">Transactions</Heading>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {transactions.length > 0 ? (
              transactions?.map((transaction) => {
                return (
                  <HStack
                    borderWidth="1"
                    p={3}
                    w="100%"
                    borderRadius={10}
                    my={2}
                    borderColor="gray.300"
                    justifyContent="space-between"
                  >
                    <Box w="10%" display="flex" justifyContent="center">
                      <MaterialCommunityIcons
                        name="call-received"
                        size={24}
                        color={primaryColor}
                      />
                    </Box>

                    <HStack space={2} justifyContent="space-between" w="90%">
                      <VStack>
                        <Text fontSize="lg">
                          {checkTransactionType(transaction) === "Sender"
                            ? "Sent"
                            : "Received"}
                        </Text>
                        <Text fontSize="xs">
                          {checkTransactionType(transaction) === "Sender"
                            ? "To: " + shortenAddress(transaction.to)
                            : "From: " + shortenAddress(transaction.from)}
                          {/* {shortenAddress(
                          checkTransactionType(transaction) === "Sender"
                            ? transaction.to
                            : transaction.from
                        )} */}
                        </Text>
                      </VStack>
                      <VStack>
                        <Text>
                          {transaction.value}
                          {transaction.asset}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                );
              })
            ) : (
              <Text>No transactions yet</Text>
            )}
            {isLoading && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" color={primaryColor} />
              </Box>
            )}
          </ScrollView>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Profile;
