import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { Box, Center, Text, VStack, Image, Heading } from "native-base";

function NFTNotFound() {
  return (
    <Box safeArea height="100%" w="100%" p={10}>
      <VStack space={11} alignItems="center" justifyContent="space-between">
        <Image
          size={350}
          source={require("../../assets/images/Not-found.png")}
          alt="Alternate Text"
          resizeMode="contain"
        />
        <Heading size="lg" textAlign="center">
          Oops!!. You do not own any NFT
        </Heading>
      </VStack>
    </Box>
  );
}

export default NFTNotFound;
