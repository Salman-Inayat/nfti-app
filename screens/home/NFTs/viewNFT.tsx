import {
  Box,
  VStack,
  Image,
  Text,
  HStack,
  Button,
  useDisclose,
  Heading,
  ScrollView,
} from "native-base";
// import { Image } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStore } from "../../../store";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { ethers } from "ethers";
import ConnectWalletActionSheet from "../../../components/ActionSheet";
import { getETHPriceInUSD } from "../../../utils/walletUtils";
import { useState, useEffect } from "react";

const ViewNFT = ({ route, navigation }) => {
  const { nft } = route.params;
  const { connector, signer } = useStore();
  const [priceInUSD, setPriceInUSD] = useState<Number>();

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getETHPriceInUSD(nft.price);
      setPriceInUSD(balance);
    };

    fetchBalance();
  }, []);

  // const priceInUSD = (async () => await getETHPriceInUSD(nft.price))();

  const { isOpen, onOpen, onClose } = useDisclose();

  const buyNFT = async (nft) => {
    if (connector?.connected) {
      const contract = new ethers.Contract(
        marketplaceAddress,
        marketplaceJSON.abi,
        signer
      );
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();

      navigation.navigate("Dashboard", {
        screen: "Own",
      });
    } else {
      onOpen();
    }
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Box px={6} safeArea w="100%">
        <VStack
          space={5}
          alignItems="center"
          justifyContent="space-between"
          w="100%"
        >
          <Image
            size={310}
            source={{
              uri: nft.image,
            }}
            borderRadius={20}
            alt="NFT image"
          />
          <VStack
            w="90%"
            space={5}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Heading size="lg">{nft.name}</Heading>
            <Text fontSize="md">{nft.description}</Text>

            <VStack
              space={2}
              style={{
                width: "100%",
                paddingTop: 10,
                paddingBottom: 10,
                // paddingLeft: 5,
                // borderColor: "grey",
                // borderWidth: 2,
                // borderRadius: 10,
              }}
            >
              <Text fontSize="xs">Current price</Text>
              <HStack justifyContent="space-between">
                <HStack alignItems="center" ml={-1}>
                  <MaterialCommunityIcons
                    name="ethereum"
                    size={24}
                    color="black"
                  />
                  <Heading size="lg">{nft.price}</Heading>
                </HStack>
                <Text fontSize="lg" mr={2}>
                  $ {priceInUSD?.toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <Button
            mt={5}
            size="lg"
            w="90%"
            onPress={() => {
              buyNFT(nft);
            }}
            borderRadius={50}
          >
            Buy
          </Button>
        </VStack>
        <ConnectWalletActionSheet
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </Box>
    </ScrollView>
  );
};

export default ViewNFT;
