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
  const { attachWallet, detachWallet } = useStore();

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(async () => {
    const connected = await connector.connect();

    const provider = new WalletConnectProvider({
      rpc: {
        5: "https://rpc.goerli.mudit.blog/",
      },
      chainId: 5,
      infuraId: "f62aa0828a7f4e1bbee0fb73cad0388d",
      connector: connector,
      qrcode: false,
    });

    // await provider.enable();

    // const ethersProvider = new ethers.providers.Web3Provider(provider);
    // const signer = ethersProvider.getSigner();
    // console.log({ ethersProvider });

    // const balance = await ethersProvider.getBalance(session.accounts[0]);
    // console.log("balance", balance.toString());
    // const balanceFormatted = ethers.utils.formatEther(balance);

    // console.log({ balanceFormatted });

    // attachWallet(walletData);
  }, [connector]);

  useEffect(() => {
    if (connector.connected) {
      const provider = new WalletConnectProvider({
        // rpc: {
        //   5: "https://rpc.goerli.mudit.blog/",
        // },
        chainId: 5,
        infuraId: "f62aa0828a7f4e1bbee0fb73cad0388d",
        connector: connector,
        qrcode: false,
      });

      console.log("Provider: ", provider);

      // const network = "goerli"; // use rinkeby testnet
      const demoProvider = new ethers.providers.JsonRpcProvider();
      const address = connector.accounts[0];
      demoProvider.getBalance(address).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log(`balance: ${balanceInEth} ETH`);
      });

      const marketplace = new ethers.Contract(
        marketplaceAddress,
        marketplaceJSON.abi,
        demoProvider
      );

      const fetchListingPrice = async () => {
        return await marketplace.getListingPrice();
      };

      fetchListingPrice()
        .then((res) => console.log(res.toString()))
        .catch((err) => console.log(err));

      // let listingPrice = fetchListingPrice()

      // listingPrice = listingPrice.toString();

      // console.log({ listingPrice });
    }
  }, [connector]);

  const removeWallet = React.useCallback(async () => {
    // await detachWallet();
    return connector.killSession();
    // AsyncStorage.removeItem("@walletconnect/qrcode-modal-react-native:session");
  }, [connector]);

  const performTransaction = async () => {
    console.log("clicked");
    // const provider = ethers.providers.getDefaultProvider();
    // const signer = provider.getSigner();

    /* create the NFT */
    const price = ethers.utils.parseUnits("0.25", "ether");
    const marketplace = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      ethersProvider
    );

    // console.log({ marketplace });
    console.log(await marketplace.getListingPrice());

    // let listingPrice = await marketplace.getListingPrice();

    // listingPrice = listingPrice.toString();

    // console.log({ listingPrice });

    // let transaction = await marketplace.createToken(
    //   "http://sasadasd.dsadsadsa",
    //   price,
    //   {
    //     value: 12,
    //   }
    // );

    // console.log({ transaction });
    // await transaction.wait();
  };

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
                screen: "Home",
              })
            }
          >
            Explore NFTs
          </Button>
          <Button
            style={styles.buttonStyle}
            onPress={() => performTransaction()}
          >
            Perform transaction
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
