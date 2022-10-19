import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, Container, Button } from "native-base";

import WalletConnectProvider from "@walletconnect/web3-provider";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useStore } from "../../store";

import "react-native-get-random-values";

import "@ethersproject/shims";
import { ethers } from "ethers";
import { marketplaceAddress, marketplaceJSON } from "../../config";
import { EtherscanProvider } from "@ethersproject/providers";

const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 8)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
};

const ConnectWalletScreen = ({ navigation }) => {
  const { attachWallet, detachWallet, setUserWalletConnection } = useStore();

  const connector = useWalletConnect();

  const connectWallet = async () => {
    const connected = await connector.connect();
  };

  useEffect(() => {
    if (connector.connected) {
      const walletProvider = new WalletConnectProvider({
        chainId: 5,
        infuraId: "f62aa0828a7f4e1bbee0fb73cad0388d",
        connector: connector,
        qrcode: false,
      });

      let wp = (async () => {
        return await walletProvider.enable();
      })();

      wp.then((res) => {
        const provider = new ethers.providers.Web3Provider(walletProvider);

        const signer = provider.getSigner();

        const data = {
          connector,
          provider,
          signer,
          navigation,
        };

        setUserWalletConnection(data);
      }).catch((err) => console.log(err));
    }
  }, [connector]);

  const removeWallet = React.useCallback(async () => {
    // await detachWallet();
    return connector.killSession();
    // AsyncStorage.removeItem("@walletconnect/qrcode-modal-react-native:session");
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

          <Button
            style={styles.buttonStyle}
            onPress={() =>
              navigation.navigate("Dashboard", {
                screen: "NFTs",
                params: {
                  screen: "Home",
                },
              })
            }
          >
            Explore NFTs
          </Button>

          <Button onPress={() => removeWallet()} style={styles.buttonStyle}>
            Remove wallet
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
