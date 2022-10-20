import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack, Box, Heading, Text, useDisclose } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { useStore } from "../../store";
import { useState } from "react";
import { ethers } from "ethers";

const BalanceBox = ({ walletBalance }: { walletBalance: string }) => {
  return (
    <HStack space={120}>
      <Box>
        <Text color="white" fontSize="sm">
          {" "}
          Current balance
        </Text>
        <Heading color="white" size="xl" style={styles.balance_text} mt={2}>
          {walletBalance} ETH
        </Heading>
      </Box>
      <MaterialCommunityIcons name="ethereum" size={70} color="white" />
    </HStack>
  );
};

const WalletNotConnected = ({ onOpen }) => {
  return (
    <Box>
      <Text color="white" fontSize="md" onPress={onOpen}>
        Connect your wallet to view balance
      </Text>
    </Box>
  );
};

const BalanceContainer = () => {
  const { connector, provider } = useStore();
  const { isOpen, onOpen, onClose } = useDisclose();

  const [walletBalance, setWalletBalance] = useState("");

  const getWalletBalance = async (address: any) => {
    const balance = await provider.getBalance(address).then();
    const balanceInEth = ethers.utils.formatEther(balance);
    setWalletBalance(balanceInEth.substring(0, 4));
  };

  if (connector?.connected) {
    (async () => await getWalletBalance(connector.accounts[0]))();
  }

  return (
    <Box style={styles.balance_box} alignItems="center">
      <ImageBackground
        source={require("../../assets/images/balance_box_background.png")}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <Box style={styles.inner_box}>
          {connector?.connected ? (
            <BalanceBox walletBalance={walletBalance} />
          ) : (
            <WalletNotConnected onOpen={onOpen} />
          )}
        </Box>
      </ImageBackground>
    </Box>
  );
};

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

export default BalanceContainer;
