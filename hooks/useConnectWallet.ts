import React, { useState, useEffect } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useStore } from "../store";

export default function useConnectWallet() {
  const connector = useWalletConnect();
  const { setUserWalletConnection } = useStore();

  const connectWallet = async () => {
    await connector.connect();
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
        };

        setUserWalletConnection(data);
      }).catch((err) => console.log(err));
    }
  }, [connector]);

  return {
    connectWallet,
  };
}
