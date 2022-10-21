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
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ navigation }) => {
  const { connector } = useStore();
  const toast = useToast();

  useFocusEffect(
    React.useCallback(() => {
      console.log(connector?._peerMeta);
    }, [])
  );

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

  // get transactions from the blockchain and display them
  const getTransactions = async () => {
    // let etherscanProvider = new ethers.providers.EtherscanProvider();

    // const history = await etherscanProvider.getHistory(connector?.accounts[0]);
    // console.log(history);
    let data = JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          fromAddress: connector.accounts[0],
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        },
      ],
    });

    var requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    const apiKey = "hBLwhx2rYMaPbySIvWmIxV0sicTQqVSz";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
    const axiosURL = `${baseURL}`;

    axios(axiosURL, requestOptions)
      .then((response) => console.log(JSON.stringify(response.data, null, 2)))
      .catch((error) => console.log(error));
  };

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
          </HStack>

          <Button onPress={getTransactions} borderRadius={50}>
            get history
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Profile;
