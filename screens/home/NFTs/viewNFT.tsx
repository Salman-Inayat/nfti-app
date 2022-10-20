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
import ReadMore from "@fawazahmed/react-native-read-more";
import TextLessMoreView from "../../../components/TextMoreOrLess";

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
      <Box px={6} my={5} w="100%">
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
            space={1}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Heading size="lg">{nft.name}</Heading>
            {/* <Text fontSize="md">
              {nft.description} Setting a timer for a long period of time, i.e.
              multiple minutes, is a performance and correctness issue on
              Android as it keeps the timer module awake, and timers can only be
              called when the app is in the foreground.
            </Text> */}
            <TextLessMoreView
              targetLines={2}
              text={`${nft.description} Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground.`}
            ></TextLessMoreView>

            <VStack
              space={2}
              style={{
                width: "100%",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text fontSize="xs">Current price</Text>
              {/* <HStack justifyContent="space-between"> */}
              <HStack alignItems="center" ml={-1.5}>
                <MaterialCommunityIcons
                  name="ethereum"
                  size={24}
                  color="black"
                />
                <Heading size="lg">{nft.price}</Heading>
              </HStack>
              <Text fontSize="sm">$ {priceInUSD?.toFixed(2)}</Text>
              {/* </HStack> */}
            </VStack>
          </VStack>
          <Button
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
