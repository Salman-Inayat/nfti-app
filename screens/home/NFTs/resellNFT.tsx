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
  FormControl,
  Heading,
  Input,
} from "native-base";
import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ethers } from "ethers";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { useStore } from "../../../store";

const ResellNFT = ({ route, navigation }) => {
  const { nft } = route.params;
  const [price, setPrice] = useState();
  const { connector, privider, signer } = useStore();

  const handlePriceChange = (text) => {
    setPrice(text);
  };

  async function listNFTForSale() {
    if (!price) return;

    const priceFormatted = ethers.utils.parseUnits(price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(nft.tokenId, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();
    navigation.navigate("Dashboard", {
      screen: "NFTs",
      params: {
        screen: "Home",
      },
    });
  }

  return (
    <Box px={6} safeArea w="100%">
      <Image
        height={500}
        width={500}
        source={{
          uri: nft.image,
        }}
        alt="Alternate Text"
        size="2xl"
      />

      <FormControl mt={10}>
        <FormControl.Label>Price</FormControl.Label>
        <Input
          placeholder="Price in ETH"
          onChangeText={(text) => handlePriceChange(text)}
          value={price}
          keyboardType="numeric"
        />
      </FormControl>
      <Button onPress={() => listNFTForSale()} borderRadius={50}>
        List
      </Button>
    </Box>
  );
};

export default ResellNFT;
