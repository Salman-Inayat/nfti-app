import {
  Text,
  Button,
  VStack,
  Container,
  Box,
  Image,
  Center,
  Skeleton,
  HStack,
} from "native-base";
import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useStore } from "../../store";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  contractNetwork,
  marketplaceAddress,
  marketplaceJSON,
} from "../../config";
import ConnectWalletAlert from "../../components/ConnectWalletAlert";
import NFTNotFound from "../../components/NotFound";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const OwnNFTs = ({ navigation }) => {
  const { connector, provider, signer } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [walletHasBalance, setWalletHasBalance] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    setIsLoading(true);
    setNfts([]);
    if (isFocused) {
      loadNFTs();
    }
  }, [isFocused, connector]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     loadNFTs();
  //   }, [])
  // );

  const getWalletBalance = async (address: any) => {
    const balance = await provider.getBalance(address).then();
    const balanceInEth = ethers.utils.formatEther(balance);
    return balanceInEth === "0.0" ? false : true;
  };

  const loadNFTs = async () => {
    setWalletHasBalance(false);

    const hasBalance = await getWalletBalance(connector?.accounts[0]);
    if (hasBalance) {
      const contract = new ethers.Contract(
        marketplaceAddress,
        marketplaceJSON.abi,
        signer
      );

      const data = await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (item) => {
          const tokenUri = await contract.tokenURI(item.tokenId);
          const meta = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            "ether"
          );
          let itemToReturn = {
            price,
            tokenId: item.tokenId.toNumber(),
            seller: item.seller,
            owner: item.owner,
            image: meta.data.image,
            name: meta.data.name,
            tokenUri,
          };
          return itemToReturn;
        })
      );

      setNfts(items);
      setIsLoading(false);
      setWalletHasBalance(true);
    } else {
      setNfts([]);
      setIsLoading(false);
      setWalletHasBalance(false);
    }
  };

  const resellNFT = (nft) => {
    navigation.navigate("Dashboard", {
      screen: "NFTs",
      params: {
        screen: "ResellNFT",
        params: {
          nft: nft,
        },
      },
    });
  };

  // const { isLoading, error, data, refetch } = useQuery(["own-nfts"], loadNFTs);

  // useRefetchOnFocus(refetch);

  if (!connector?.connected) {
    return (
      <ConnectWalletAlert alertText="Please attach your wallet to view NFTs you own" />
    );
  }

  // if (!isLoading && !nfts?.length) return <NFTNotFound />;

  const Loading = () => {
    // if (isLoading && !nfts.length)
    return (
      <Box w="100%">
        <VStack h="100%" space={6}>
          {[1, 2, 3, 4, 5].map((item, index) => {
            return (
              <HStack
                w="100%"
                maxW="400"
                borderWidth="1"
                space={5}
                overflow="hidden"
                rounded="md"
                _dark={{
                  borderColor: "coolGray.500",
                }}
                _light={{
                  borderColor: "coolGray.200",
                }}
                h={150}
                p={2}
                key={index}
              >
                <Skeleton
                  w="40"
                  h="100%"
                  flex="2"
                  rounded="md"
                  startColor="coolGray.200"
                />
                <VStack space={4} flex="2" py={2}>
                  <Skeleton
                    rounded="full"
                    h="5"
                    startColor="coolGray.200"
                    mb={1}
                  />
                  <Skeleton
                    rounded="full"
                    h="5"
                    startColor="coolGray.200"
                    mb={1}
                  />
                  <Skeleton h="10" rounded="full" startColor="coolGray.200" />
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    );
  };
  // if (error) return <Text>An error occured </Text>;

  if (!isLoading && !walletHasBalance) {
    return (
      <Box safeArea px={6}>
        <Text fontSize="lg">
          Please topup your wallet to view NFTs you own.
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Box safeArea px={6}>
        {/* {!walletHasBalance &&  ? (
          <Text>
            You don't have balance in your wallet. Please add some funds to your
            wallet to view own NFTs
          </Text>
        ) : ( */}
        <VStack h="100%" space={4}>
          {isLoading && !nfts.length ? (
            <Loading />
          ) : nfts?.length > 0 ? (
            nfts?.map((nft, index) => {
              return (
                <HStack
                  w="100%"
                  maxW="400"
                  space={5}
                  overflow="hidden"
                  rounded="md"
                  h={150}
                  p={2}
                  borderWidth="1"
                  _dark={{
                    borderColor: "coolGray.500",
                  }}
                  _light={{
                    borderColor: "coolGray.200",
                  }}
                  key={index}
                >
                  <Image
                    source={{
                      uri: nft.image,
                    }}
                    width="50%"
                    height="100%"
                    alt="Alternate Text"
                    borderRadius={10}
                  />
                  <VStack space={3} flex="2" py={2}>
                    <Text fontSize="lg">{nft.name}</Text>
                    <HStack alignItems="center" ml={-1} mb={2}>
                      <MaterialCommunityIcons
                        name="ethereum"
                        size={24}
                        color="grey"
                      />
                      <Text fontSize="md">{nft.price} ETH</Text>
                    </HStack>
                    <Button
                      borderRadius={50}
                      onPress={() => {
                        resellNFT(nft);
                      }}
                    >
                      Resell
                    </Button>
                  </VStack>
                </HStack>
              );
            })
          ) : (
            !isLoading && nfts?.length == 0 && <NFTNotFound />
          )}
        </VStack>
        {/* )} */}
      </Box>
    </ScrollView>
  );
};

export default OwnNFTs;
