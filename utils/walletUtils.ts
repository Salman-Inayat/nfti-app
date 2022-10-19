import axios from "axios";

export const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 8)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
};

export const getETHPriceInUSD = async (priceInETH) => {
  const response = await axios.get(
    "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
  );

  const balanceInUSD = response.data.USD;

  return balanceInUSD * priceInETH;
};
