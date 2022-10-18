import { Box, VStack, Image, Text, HStack, Button } from "native-base";
import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStore } from "../../../store";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { ethers } from "ethers";

const ViewNFT = ({ route, navigation }) => {
  const { nft } = route.params;
  const { connector, privider, signer } = useStore();

  const buyNFT = async (nft) => {
    const contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      signer
    );
    console.log("1");

    console.log("Price: ", nft.price);
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    console.log({ transaction });
    console.log("2");
    await transaction.wait();
    console.log("3");

    navigation.navigate("Dashboard", {
      screen: "Own",
    });
  };

  const getTransactions = () => {
    let address = connector.accounts[0];
    let etherscanProvider = new ethers.providers.EtherscanProvider();

    etherscanProvider.getHistory(address).then((history) => {
      history.forEach((tx) => {
        console.log(tx);
      });
    });
  };

  return (
    <Box px={6} safeArea w="100%">
      <VStack space={5}>
        <Image
          height={500}
          width={500}
          source={{
            uri: nft.image,
          }}
          alt="Alternate Text"
          size="xl"
        />
        <Text fontSize="lg">{nft.name}</Text>
        <Text fontSize="lg">{nft.description}</Text>

        <HStack alignItems="center">
          <MaterialCommunityIcons name="ethereum" size={20} color="black" />
          <Text fontSize="md">{nft.price}</Text>
        </HStack>
        <Button
          onPress={() => {
            buyNFT(nft);
            // getTransactions();
          }}
        >
          Buy
        </Button>
      </VStack>
    </Box>
  );
};

export default ViewNFT;
