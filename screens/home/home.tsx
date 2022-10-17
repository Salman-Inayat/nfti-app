import {
  Text,
  Button,
  VStack,
  Container,
  Box,
  Image,
  Center,
  Skeleton,
} from "native-base";
import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useStore } from "../../store";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { marketplaceAddress, marketplaceJSON } from "../../config";
import { getItemFromAsyncStorage } from "../../utils/handleAsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { connector, provider, signer } = useStore();

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

    return items;
  };

  const { isLoading, error, data } = useQuery(["nfts"], loadNFTs);

  if (!isLoading && !data.length) return <Text>No items in marketplace</Text>;

  if (isLoading)
    return (
      <Center w="100%">
        <VStack
          w="80%"
          maxW="400"
          borderWidth="1"
          space={8}
          overflow="hidden"
          rounded="md"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="40" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
        </VStack>
      </Center>
    );

  if (error) return <Text>An error occured </Text>;

  return (
    <View>
      <VStack space={3} alignItems="center">
        <View>
          {data?.map((nft, index) => {
            return (
              <Box m={2} key={index} height="200px" width="70%">
                <Image
                  source={{
                    uri: nft.image,
                  }}
                  width="100px"
                  height="100px"
                  alt="Alternate Text"
                  size="xl"
                />
                <Text>{nft.name}</Text>
                <Text>{nft.description}</Text>
                <Text>{nft.price}</Text>
              </Box>
            );
          })}
        </View>
      </VStack>
    </View>
  );
};

export default Home;
