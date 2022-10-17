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

const OwnNFTs = ({ navigation }) => {
  const { connector, provider, signer } = useStore();

  const loadNFTs = async () => {
    const contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      signer
    );

    const data = await contract.fetchMyNFTs();

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
          tokenUri,
        };
        return itemToReturn;
      })
    );

    console.log(items);
    return items;
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

  const { isLoading, error, data } = useQuery(["own-nfts"], loadNFTs);

  if (!isLoading && !data.length)
    return (
      <Box safeArea px={6}>
        <Center>
          <Text fontSize="lg">No NFTs owned</Text>
        </Center>
      </Box>
    );

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
    <Box safeArea px={6}>
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
                <Text>{nft.price} ETH</Text>
                <Button
                  onPress={() => {
                    resellNFT(nft);
                  }}
                >
                  Resell
                </Button>
              </Box>
            );
          })}
        </View>
      </VStack>
    </Box>
  );
};

export default OwnNFTs;
