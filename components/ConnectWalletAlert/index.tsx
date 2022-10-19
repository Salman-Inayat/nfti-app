import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  Box,
  Center,
  Text,
  VStack,
  Image,
  useDisclose,
  Button,
  Heading,
} from "native-base";
import useConnectWallet from "../../hooks/useConnectWallet";

function ConnectWalletAlert({ alertText }: { alertText: string }) {
  const { connectWallet } = useConnectWallet();

  return (
    <Center safeArea height="100%" w="100%" p={10}>
      <Box>
        <VStack
          space={10}
          alignItems="center"
          justifyContent="space-between"
          h="70%"
        >
          <Heading size="md">No wallet found</Heading>
          <Image
            size={130}
            source={require("../../assets/images/Wallet_Image.png")}
            alt="Alternate Text"
            resizeMode="contain"
          />

          <Text fontSize="md" textAlign="center">
            {alertText}
          </Text>
          <Button onPress={() => connectWallet()} w="100%" borderRadius={50}>
            Connect Wallet
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default ConnectWalletAlert;
