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
import Loader from "../../../components/Loader";

const ResellNFT = ({ route, navigation }: { route: any; navigation: any }) => {
  const { nft } = route.params;
  const [price, setPrice] = useState("");
  const { connector, signer } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePriceChange = (text: string) => {
    setPrice(text);
  };

  async function listNFTForSale() {
    if (price === "") return;

    setIsProcessing(true);
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
    setIsProcessing(false);
    navigation.navigate("Dashboard", {
      screen: "NFTs",
      params: {
        screen: "Home",
      },
    });
  }

  return (
    <Box px={6} safeArea w="100%" display="flex" alignItems="center">
      <VStack space={4} p={2} alignItems="center" w="80%">
        <Image
          borderRadius={10}
          source={{
            uri: nft.image,
          }}
          alt="Alternate Text"
          size="2xl"
        />

        <VStack space={8} w="100%">
          <FormControl mt={10}>
            <FormControl.Label>Price</FormControl.Label>
            <Input
              placeholder="Enter new price in ETH"
              onChangeText={(text) => handlePriceChange(text)}
              value={price}
              keyboardType="numeric"
            />
          </FormControl>
          <Button
            onPress={() => listNFTForSale()}
            borderRadius={50}
            isDisabled={price !== "" ? false : true}
          >
            Resell
          </Button>
        </VStack>
      </VStack>
      <Loader loading={isProcessing} text="Processing..." />
    </Box>
  );
};

export default ResellNFT;
