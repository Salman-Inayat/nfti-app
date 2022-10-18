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
  Heading,
} from "native-base";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  FlatList,
} from "react-native";
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

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const Home = ({ navigation }) => {
  const { connector, provider, signer } = useStore();
  // const [loading, setLoading] = useState(false);
  // const [NFTs, setNFTs] = useState([]);

  // useEffect(() => {
  //   loadNFTs();
  //   setLoading(false);
  // }, []);

  const loadNFTs = async () => {
    // setLoading(true);
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

  const { isLoading, error, data } = useQuery(["marketplace-nfts"], loadNFTs);

  if (!isLoading && !data.length) return <Text>No items in marketplace</Text>;

  if (isLoading)
    return (
      <Box w="100%" mt={5} px={5} py={3}>
        <VStack space={6} w="100%">
          {[1, 2, 3].map((data, index) => {
            return (
              <VStack
                w="100%"
                maxW="600"
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
                key={index}
              >
                <Skeleton h="40" />
                <Skeleton.Text px="4" mb={5} />
              </VStack>
            );
          })}
        </VStack>
      </Box>
    );

  if (error) return <Text>An error occured </Text>;

  const viewSingleNFT = (nft) => {
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

  const renderItem = (nft) => {
    const { item } = nft;
    return (
      <Pressable onPress={() => viewSingleNFT(item)} width="50%" px={1} py={2}>
        <VStack
          w="100%"
          borderWidth="1"
          overflow="hidden"
          rounded="xl"
          _dark={{
            borderColor: "coolGray.700",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Image
            source={{
              uri: item.image,
            }}
            alt="Alternate Text"
            size="xl"
            style={{
              width: "100%",
              height: 200,
            }}
          />
          <Box p={5} style={styles.price_container}>
            <Text fontSize="lg">{item.name}</Text>

            <HStack alignItems="center">
              <MaterialCommunityIcons name="ethereum" size={20} color="black" />
              <Text fontSize="sm">{item.price} ETH</Text>
            </HStack>
          </Box>
        </VStack>
      </Pressable>
    );
  };

  return (
    <Box px={6} safeArea w="100%">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <VStack space={4}>
          <Box style={styles.balance_box} alignItems="center">
            <ImageBackground
              source={require("../../../assets/images/balance_box_background.png")}
              style={styles.image}
              imageStyle={{ borderRadius: 20 }}
            >
              <Box style={styles.inner_box}>
                <HStack space={120}>
                  <Box>
                    <Text color="white" fontSize="sm">
                      {" "}
                      Current balance
                    </Text>
                    <Heading
                      color="white"
                      size="xl"
                      style={styles.balance_text}
                      mt={2}
                    >
                      3554 ETH
                    </Heading>
                  </Box>
                  <MaterialCommunityIcons
                    name="ethereum"
                    size={70}
                    color="white"
                  />
                </HStack>
              </Box>
            </ImageBackground>
          </Box>
          {/* {data?.map((nft, index) => {
              return (
                <Pressable onPress={() => viewSingleNFT(nft)} key={index}>
                  <VStack
                    w="100%"
                    borderWidth="1"
                    overflow="hidden"
                    rounded="xl"
                    _dark={{
                      borderColor: "coolGray.700",
                    }}
                    _light={{
                      borderColor: "coolGray.200",
                    }}
                  >
                    <Image
                      source={{
                        uri: nft.image,
                      }}
                      alt="Alternate Text"
                      size="xl"
                      style={{
                        width: "100%",
                        height: 200,
                      }}
                    />
                    <Box p={5} style={styles.price_container}>
                      <Text fontSize="lg">{nft.name}</Text>

                      <HStack alignItems="center">
                        <MaterialCommunityIcons
                          name="ethereum"
                          size={20}
                          color="black"
                        />
                        <Text fontSize="md">{nft.price}</Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Pressable>
              );
            })} */}

          <FlatList
            data={data}
            renderItem={renderItem}
            numColumns={2}
            style={{
              flex: 1,
              marginVertical: 20,
            }}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default Home;

const styles = StyleSheet.create({
  balance_box: {
    height: 150,
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  inner_box: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  balance_text: {
    fontWeight: "300",
  },
  price_container: {
    backgroundColor: "#ffffff",
  },
});
