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
  Pressable,
} from "native-base";
import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useStore } from "../../../store";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { getItemFromAsyncStorage } from "../../../utils/handleAsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const { connector, provider, signer } = useStore();
  console.log({ navigation });

  const loadNFTs = async () => {
    const contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      provider
    );

    const data = await contract.fetchMarketItems();

    /*
    Map over items returned from smart contract and format them
    as well as fetch their metadata
   */
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await contract.tokenURI(item.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), "ether");
        let itemToReturn = {
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.seller,
          owner: item.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return itemToReturn;
      })
    );

    console.log(items);
    return items;
  };

  const { isLoading, error, data } = useQuery(["marketplace-nfts"], loadNFTs);

  if (!isLoading && !data.length) return <Text>No items in marketplace</Text>;

  if (isLoading)
    return (
      <Center w="100%" mt={5}>
        <VStack
          w="80%"
          maxW="400"
          borderWidth="1"
          space={8}
          overflow="hidden"
          rounded="xl"
          _dark={{
            borderColor: "coolGray.700",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="40" />
          <Skeleton.Text px="4" mb={5} />
        </VStack>
      </Center>
    );

  if (error) return <Text>An error occured </Text>;

  const viewSingleNFT = (nft) => {
    console.log("Pressed");
    navigation.navigate("Dashboard", {
      screen: "NFTs",
      params: {
        screen: "ViewNFT",
        params: {
          nft: nft,
        },
      },
    });
  };

  return (
    <Box px={6} safeArea w="100%">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <VStack space={6}>
          {data?.map((nft, index) => {
            return (
              <Pressable onPress={() => viewSingleNFT(nft)} key={index}>
                <VStack
                  w="100%"
                  borderWidth="1"
                  space={3}
                  overflow="hidden"
                  rounded="xl"
                  _dark={{
                    borderColor: "coolGray.700",
                  }}
                  _light={{
                    borderColor: "coolGray.200",
                  }}
                  p={4}
                >
                  <Image
                    source={{
                      uri: nft.image,
                    }}
                    alt="Alternate Text"
                    size="xl"
                  />
                  <Text fontSize="lg">{nft.name}</Text>

                  <HStack alignItems="center">
                    <MaterialCommunityIcons
                      name="ethereum"
                      size={20}
                      color="black"
                    />
                    <Text fontSize="md">{nft.price}</Text>
                  </HStack>
                </VStack>
              </Pressable>
            );
          })}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default Home;
