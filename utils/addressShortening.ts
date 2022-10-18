export const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 8)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
};
