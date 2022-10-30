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
  useToast,
} from "native-base";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStore } from "../../../store";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { ethers } from "ethers";
import ConnectWalletActionSheet from "../../../components/ActionSheet";
import { getETHPriceInUSD, shortenAddress } from "../../../utils/walletUtils";
import { useState, useEffect } from "react";
import TextLessMoreView from "../../../components/TextMoreOrLess";
import Loader from "../../../components/Loader";
import { useIsFocused } from "@react-navigation/native";

const ViewNFT = ({ route, navigation }) => {
  const { nft } = route.params;

  const { connector, signer } = useStore();
  const [priceInUSD, setPriceInUSD] = useState<Number>();
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setIsProcessing(false);
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getETHPriceInUSD(nft.price);
      setPriceInUSD(balance);
    };

    fetchBalance();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclose();

  const buyNFT = async (nft) => {
    if (connector?.connected) {
      if (connector?.accounts[0] === nft.seller) {
        toast.show({
          id: "own-nft-error",
          duration: 1000,
          render: () => {
            return (
              <Box bg="primary.600" px="2" py="2" rounded="md" mb={5}>
                <Text color="white">You can't buy your own NFT</Text>
              </Box>
            );
          },
        });
        return;
      }
      try {
        setIsProcessing(true);
        const contract = new ethers.Contract(
          marketplaceAddress,
          marketplaceJSON.abi,
          signer
        );
        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        const transaction = await contract.createMarketSale(nft.tokenId, {
          value: price,
        });
        console.log({ transaction });
        const transactionResponse = await transaction.wait();
        console.log({ transactionResponse });

        setIsProcessing(false);
        navigation.navigate("Dashboard", {
          screen: "Own",
        });
      } catch (err) {
        console.log(err);
        console.log(typeof err);
        setIsProcessing(false);
        if (Object.values(err).includes("insufficient funds")) {
          toast.show({
            id: "insufficient-funds",
            duration: 1000,
            render: () => {
              return (
                <Box bg="primary.600" px="2" py="2" rounded="md" mb={5}>
                  <Text color="white">Insufficient funds</Text>
                </Box>
              );
            },
          });
        } else if (
          Object.values(err).includes("User rejected the transaction")
        ) {
          toast.show({
            id: "rejected-transaction",
            duration: 1500,
            render: () => {
              return (
                <Box bg="primary.600" px="2" py="2" rounded="md" mb={5}>
                  <Text color="white">User rejected the transaction</Text>
                </Box>
              );
            },
          });
        }
      }
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

            <TextLessMoreView
              targetLines={2}
              text={nft.description}
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
              <HStack alignItems="center" ml={-1.5}>
                <MaterialCommunityIcons
                  name="ethereum"
                  size={24}
                  color="black"
                />
                <Heading size="lg">{nft.price}</Heading>
              </HStack>
              <Text fontSize="sm">$ {priceInUSD?.toFixed(2)}</Text>
            </VStack>
            <HStack space={2} w="100%">
              <Text>Seller: {shortenAddress(nft.seller)}</Text>
            </HStack>
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
      <Loader loading={isProcessing} text="Processing..." />
    </ScrollView>
  );
};

export default ViewNFT;
