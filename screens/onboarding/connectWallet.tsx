import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, Container, Button } from "native-base";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useStore } from "../../store";

const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 8)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
};

const ConnectWalletScreen = ({ navigation }) => {
  const connector = useWalletConnect();
  const { attachWallet, detachWallet } = useStore();

  const connectWallet = React.useCallback(async () => {
    const connected = await connector.connect();
    const walletData = {
      address: connected.accounts[0],
      account: {
        icon: connected.peerMeta.icons[0],
        name: connected.peerMeta.name,
      },
    };

    attachWallet(walletData);
  }, [connector]);

  const removeWallet = React.useCallback(async () => {
    await detachWallet();
    return connector.killSession();
  }, [connector]);

  return (
    <Container style={styles.container}>
      <Text style={styles.title}>Connect a crypto wallet</Text>
      <Container style={styles.separator} />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <Text> {shortenAddress(connector.accounts[0])}</Text>
          {/* <TouchableOpacity onPress={removeWallet} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Remove wallet</Text>
          </TouchableOpacity> */}
          <Button
            style={styles.buttonStyle}
            onPress={() =>
              navigation.navigate("Dashboard", {
                screen: "Home",
              })
            }
          >
            Explore NFTs
          </Button>
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConnectWalletScreen;
