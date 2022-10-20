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

function About() {
  return (
    <Box p={10}>
      <VStack
        space={10}
        alignItems="center"
        justifyContent="space-between"
        h="70%"
      >
        <Image
          size={130}
          source={require("../../assets/images/Wallet_Image.png")}
          alt="Alternate Text"
          resizeMode="contain"
        />
        <Heading size="md" textAlign="center">
          We are building an open digital economy
        </Heading>

        <Text fontSize="md" textAlign="center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget
          augue ultrices justo varius auctor. Sed sollicitudin tincidunt
          scelerisque. Integer ultricies mollis sapien ac vestibulum.
          Pellentesque quis commodo sapien. Phasellus cursus, quam ut euismod
          viverra, mauris tortor pulvinar arcu, vel sagittis diam dolor sit amet
          risus. Donec quis odio maximus, sagittis lectus vitae, suscipit leo.
          Integer semper neque non lectus pharetra dignissim. Ut gravida, ligula
          et facilisis blandit, mi velit maximus ligula, in placerat qua.
        </Text>

        <VStack space={2}>
          <Text fontSize="sm" color="grey">
            Version 0.0.1 Build 200304
          </Text>
          <Text fontSize="sm" color="grey">
            ©2021 - 2022 Innovage.io
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}

export default About;
