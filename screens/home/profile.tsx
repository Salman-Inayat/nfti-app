import {
  Container,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  useToast,
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
import { shortenAddress } from "../../utils/walletUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";

const Profile = ({ navigation }) => {
  const { connector, provider } = useStore();
  const toast = useToast();

  const copyToClipboard = async (text: string) => {
    // await Clipboard?.setStringAsync(text);
    if (!toast.isActive("copied")) {
      toast.show({
        id: "copied",
        render: () => {
          return (
            <Box bg="white" px="2" py="2" rounded="md" mb={5} shadow={5}>
              Copied to clipboard
            </Box>
          );
        },
      });
    }
  };

  const loadNFTs = async () => {
    const provider = ethers.providers.getDefaultProvider(contractNetwork);
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

  if (!connector?.connected) {
    return <ProfileWalletNotConnected />;
  }
  return (
    <Box px={6} safeArea w="100%" h="100%">
      <VStack space={2} h="100%">
        <Box display="flex" alignItems="center" justifyContent="center" h="40%">
          <Image
            size={140}
            borderRadius={100}
            source={{
              uri: "https://wallpaperaccess.com/full/317501.jpg",
            }}
            alt="Alternate Text"
          />
        </Box>
        <VStack space={4} py={4} px={2}>
          <HStack space={2} alignItems="center">
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
          <HStack space={2} alignItems="center">
            <Text>Address</Text>
            <Text>{connector.accounts[0]}</Text>
          </HStack>
          <HStack space={2} alignItems="center">
            <Text>Network</Text>
            <Text>{contractNetwork}</Text>
          </HStack>
          <HStack space={2} alignItems="center">
            <Text>Wallet</Text>
            <Text>{connector._peerMeta.name}</Text>
            {/* <Image
              size={100}
              // borderRadius={100}
              source={{
                uri: connector._peerMeta.icons[0],
              }}
              alt="wallet image"
            /> */}

            {/* <SvgUri
              width="100%"
              height="100%"
              source={{ uri: connector._peerMeta.icons[0] }}
              // uri="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
            /> */}
          </HStack>

          {/* <Button onPress={removeWallet} borderRadius={50}>
            Remove wallet
          </Button> */}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Profile;
