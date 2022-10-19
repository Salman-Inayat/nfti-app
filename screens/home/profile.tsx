import {
  Container,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
} from "native-base";
import React, { useEffect } from "react";
import { useStore } from "../../store";
import * as Clipboard from "expo-clipboard";
import { ethers } from "ethers";
import {
  marketplaceAddress,
  marketplaceJSON,
  contractNetwork,
} from "../../config";
import axios from "axios";
import ProfileWalletNotConnected from "../../components/ProfileWalletNotConnected";

const Profile = ({ navigation }) => {
  const { connector, provider } = useStore();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const loadNFTs = async () => {
    const provider = ethers.providers.getDefaultProvider(contractNetwork);
    console.log(provider);
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

    console.log(items);
    return items;
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  const removeWallet = () => {
    connector.killSession();
  };

  if (!connector?.connected) {
    return <ProfileWalletNotConnected />;
  }
  return (
    <Box px={6} safeArea w="100%">
      <Image
        size={140}
        borderRadius={100}
        source={{
          uri: "https://wallpaperaccess.com/full/317501.jpg",
        }}
        alt="Alternate Text"
      />
      <VStack space={4} py={4} px={2}>
        {/* <HStack space={2} alignItems="center">
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <MaterialIcons
            name="content-copy"
            size={18}
            color="grey"
            onPress={() => {
              copyToClipboard(connector.accounts[0]);
            }}
          />
        </HStack>
        <Text>Wallet:</Text>
        <Button onPress={getHistory}>Get history</Button>
        <Button onPress={getBalance}>Get balance</Button>*/}
        <Button onPress={removeWallet} borderRadius={50}>
          Remove wallet
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
