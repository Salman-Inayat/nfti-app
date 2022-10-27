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
  useDisclose,
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

import axios from "axios";
import {
  contractNetwork,
  marketplaceAddress,
  marketplaceJSON,
} from "../../../config";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import ConnectWalletActionSheet from "../../../components/ActionSheet";
import BalanceContainer from "../../../components/BalanceContainer";
import { useFocusEffect } from "@react-navigation/native";

interface NFTsProps {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
}

const Home = ({ navigation }: { navigation: any }) => {
  const { connector, provider } = useStore();
  const [walletBalance, setWalletBalance] = useState("");
  const { isOpen, onOpen, onClose } = useDisclose();

  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFTsProps[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      // setNfts([]);
      loadNFTs();
    }, [])
  );

  // const [favoriteNFTs, setFavoriteNFTs] = useState([]);

  // useEffect(() => {
  //   fetchFavoriteNFTs();
  // }, []);

  // const fetchFavoriteNFTs = async () => {
  //   let result = await AsyncStorage.getItem("favoriteNFTs");

  //   const parsedResult = JSON.parse(result);
  //   console.log("Parsed result: ", parsedResult);
  //   if (parsedResult.address === connector.accounts[0]) {
  //     const favoriteNFTs = parsedResult?.nfts;
  //     console.log("Favorite NFTs: ", favoriteNFTs);
  //     setFavoriteNFTs(favoriteNFTs);
  //   }
  // };

  const getWalletBalance = async (address: any) => {
    const balance = await provider.getBalance(address).then();
    const balanceInEth = ethers.utils.formatEther(balance);
    setWalletBalance(balanceInEth.substring(0, 4));
  };

  if (connector?.connected) {
    (async () => await getWalletBalance(connector.accounts[0]))();
  }

  const loadNFTs = async () => {
    setIsLoading(true);
    const provider = ethers.providers.getDefaultProvider(contractNetwork);
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "https://eth-goerli.g.alchemy.com/v2/FZeWMKll5lWJmnCIR2htG8XVPDFo1iv2",
    //   contractNetwork
    // );

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

    setIsLoading(false);
    setNfts(items);
  };

  if (isLoading && !nfts?.length)
    return (
      <VStack space={2} h="100%" px={6} my={4} w="100%">
        <Skeleton h="150" borderRadius={10} />
        <VStack space={6} h="100%">
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            renderItem={({ index }) => {
              return (
                <VStack
                  h="200"
                  w="50%"
                  borderWidth="1"
                  space={1}
                  overflow="hidden"
                  borderRadius={10}
                  _dark={{
                    borderColor: "coolGray.700",
                  }}
                  _light={{
                    borderColor: "coolGray.200",
                  }}
                  p={2}
                  style={{
                    marginRight: index % 2 !== 0 ? 0 : 10,
                  }}
                >
                  <Skeleton h="70%" w="100%" borderRadius="md" />
                  <Skeleton h="12%" w="100%" borderRadius="md" />
                  <Skeleton h="12%" w="100%" borderRadius="md" />
                </VStack>
              );
            }}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginVertical: 10,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        </VStack>
      </VStack>
    );

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

  // const manageFavorites = async (nft: { tokenId: any }) => {
  //   await AsyncStorage.getItem("favoriteNFTs", (err, result) => {
  //     const nfts = {
  //       address: connector.accounts[0],
  //       nfts: [nft],
  //     };
  //     if (result !== null) {
  //       const parsedResult = JSON.parse(result);
  //       if (parsedResult.address === connector.accounts[0]) {
  //         if (
  //           parsedResult.nfts?.some(
  //             (item: { tokenId: any }) => item.tokenId === nft.tokenId
  //           )
  //         ) {
  //           let newNFTs = parsedResult.nfts.filter(
  //             (item: { tokenId: any }) => item.tokenId !== nft.tokenId
  //           );

  //           let newFavoriteNFTS = {
  //             address: connector.accounts[0],
  //             nfts: newNFTs,
  //           };

  //           AsyncStorage.setItem(
  //             "favoriteNFTs",
  //             JSON.stringify(newFavoriteNFTS)
  //           );

  //           fetchFavoriteNFTs();
  //         } else {
  //           var newNFTs = parsedResult.nfts.concat(nfts.nfts);

  //           let newFavoriteNFTS = {
  //             address: connector.accounts[0],
  //             nfts: newNFTs,
  //           };
  //           AsyncStorage.setItem(
  //             "favoriteNFTs",
  //             JSON.stringify(newFavoriteNFTS)
  //           );
  //           fetchFavoriteNFTs();
  //         }
  //       } else {
  //         if (
  //           parsedResult.nfts?.some(
  //             (item: { tokenId: any }) => item.tokenId === nft.tokenId
  //           )
  //         ) {
  //           let newNFTs = parsedResult.nfts.filter(
  //             (item: { tokenId: any }) => item.tokenId !== nft.tokenId
  //           );

  //           let newFavoriteNFTS = {
  //             address: connector.accounts[0],
  //             nfts: newNFTs,
  //           };

  //           AsyncStorage.setItem(
  //             "favoriteNFTs",
  //             JSON.stringify(newFavoriteNFTS)
  //           );

  //           fetchFavoriteNFTs();
  //         } else {
  //           var newNFTs = parsedResult.nfts.concat(nfts.nfts);

  //           let newFavoriteNFTS = {
  //             address: connector.accounts[0],
  //             nfts: newNFTs,
  //           };
  //           AsyncStorage.setItem(
  //             "favoriteNFTs",
  //             JSON.stringify(newFavoriteNFTS)
  //           );
  //           fetchFavoriteNFTs();
  //         }
  //       }
  //     } else {
  //       AsyncStorage.setItem("favoriteNFTs", JSON.stringify(nfts));
  //       fetchFavoriteNFTs();
  //     }
  //   });
  // };

  // const isNFTFavorite = (nft: { tokenId: any }) => {
  //   const isPresent = favoriteNFTs?.some(
  //     (item) => item.tokenId === nft.tokenId
  //   );

  //   return isPresent;
  // };

  const renderItem = (nft: { item: any }) => {
    const { item } = nft;
    return (
      <Pressable onPress={() => viewSingleNFT(item)} width="50%" px={2} py={2}>
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
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
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
          <Box p={1} style={styles.price_container}>
            <Text fontSize="md" ml={1.5}>
              {item.name}
            </Text>

            <HStack space={12}>
              <HStack alignItems="center" px={0}>
                <MaterialCommunityIcons
                  name="ethereum"
                  size={14}
                  color="grey"
                />
                <Text fontSize="sm">{item.price} ETH</Text>
              </HStack>
              {/* <AntDesign
                name={isNFTFavorite(item) ? "heart" : "hearto"}
                size={18}
                color={isNFTFavorite(item) ? "red" : "black"}
                onPress={async () => await manageFavorites(item)}
              /> */}
            </HStack>
          </Box>
        </VStack>
      </Pressable>
    );
  };

  return (
    <Box px={6} my={4} w="100%">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <BalanceContainer onOpen={onOpen} />

        <FlatList
          data={nfts}
          renderItem={renderItem}
          numColumns={2}
          // keyExtractor={(item) => item.tokenId}
          style={{
            flex: 1,
            marginVertical: 20,
          }}
          // showsVerticalScrollIndicator={false}
          // showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <ConnectWalletActionSheet
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
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
