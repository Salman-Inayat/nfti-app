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
import { useStore } from "../../../store";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { marketplaceAddress, marketplaceJSON } from "../../../config";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { getActionFromState } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const { connector, provider } = useStore();
  const [walletBalance, setWalletBalance] = useState("");
  const [favoriteNFTs, setFavoriteNFTs] = useState([]);

  useEffect(() => {
    fetchFavoriteNFTs();
  }, []);

  const fetchFavoriteNFTs = async () => {
    let result = await AsyncStorage.getItem("favoriteNFTs");
    const favoriteNFTs = JSON.parse(result);
    console.log("Favorite NFTs: ", favoriteNFTs);
    setFavoriteNFTs(favoriteNFTs);
  };

  const getWalletBalance = async (address: any) => {
    const balance = await provider.getBalance(address).then();
    const balanceInEth = ethers.utils.formatEther(balance);
    setWalletBalance(balanceInEth.substring(0, 4));
  };

  (async () => await getWalletBalance(connector.accounts[0]))();

  const loadNFTs = async () => {
    const contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      provider
    );

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(
        async (item: {
          tokenId: { toNumber: () => any };
          price: { toString: () => ethers.BigNumberish };
          seller: any;
          owner: any;
        }) => {
          const tokenUri = await contract.tokenURI(item.tokenId);
          const meta = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            "ether"
          );
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
        }
      )
    );

    return items;
  };

  const { isLoading, error, data } = useQuery(["marketplace-nfts"], loadNFTs);

  if (!isLoading && !data?.length) return <Text>No items in marketplace</Text>;

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

  const viewSingleNFT = (nft: any) => {
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

  const manageFavorites = async (nft: { tokenId: any }) => {
    await AsyncStorage.getItem("favoriteNFTs", (err, result) => {
      const nfts = [nft];
      if (result !== null) {
        const favorites = JSON.parse(result);
        if (
          favorites?.some(
            (item: { tokenId: any }) => item.tokenId === nft.tokenId
          )
        ) {
          var newNFTs = JSON.parse(result).filter(
            (item: { tokenId: any }) => item.tokenId !== nft.tokenId
          );
          AsyncStorage.setItem("favoriteNFTs", JSON.stringify(newNFTs));

          fetchFavoriteNFTs();
        } else {
          var newNFTs = JSON.parse(result).concat(nfts);
          AsyncStorage.setItem("favoriteNFTs", JSON.stringify(newNFTs));
          fetchFavoriteNFTs();
        }
      } else {
        AsyncStorage.setItem("favoriteNFTs", JSON.stringify(nfts));
        fetchFavoriteNFTs();
      }
    });
  };

  const isNFTFavorite = (nft: { tokenId: any }) => {
    const isPresent = favoriteNFTs?.some(
      (item) => item.tokenId === nft.tokenId
    );

    return isPresent;
  };

  const emptyStorage = async () => {
    await AsyncStorage.removeItem("favoriteNFTs");
  };

  const renderItem = (nft: { item: any }) => {
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
              height: 150,
            }}
          />
          <Box p={2} style={styles.price_container}>
            <Text fontSize="md" ml={1.5} mb={1}>
              {item.name}
            </Text>

            <HStack space={12}>
              <HStack alignItems="center" px={0}>
                <MaterialCommunityIcons
                  name="ethereum"
                  size={20}
                  color="black"
                />
                <Text fontSize="sm">{item.price} ETH</Text>
              </HStack>
              <AntDesign
                name={isNFTFavorite(item) ? "heart" : "hearto"}
                size={18}
                color={isNFTFavorite(item) ? "red" : "black"}
                onPress={async () => await manageFavorites(item)}
              />
            </HStack>
            {/* <Button onPress={async () => await emptyStorage()}>get</Button> */}
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
                    {walletBalance} ETH
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

        <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.tokenId}
          style={{
            flex: 1,
            marginVertical: 20,
          }}
        />
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
