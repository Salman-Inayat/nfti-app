// import { create as ipfsHttpClient } from "ipfs-http-client";

// const client = ipfsHttpClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
//   headers: {
//     authorization: `Basic ${Buffer.from(
//       process.env.INFURA_IPFS_PROJECT_ID +
//         ":" +
//         process.env.INFURA_IPFS_SECRET_KEY
//     ).toString("base64")}`,
//   },
// });

const uploadImageToIPFS = async (client, imageBase64: string) => {
  const blob = await fetch(imageBase64).then((res) => res.blob());

  try {
    const added = await client.add(blob, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    console.log({ added });
    const url = `https://nfts-market.infura-ipfs.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

const uploadNFTWithMetadataToIPFS = async (client, nftData, imageURL) => {
  const { name, description, price } = nftData;

  /* first, upload metadata to IPFS */
  const data = JSON.stringify({
    name,
    description,
    image: imageURL,
  });
  try {
    const added = await client.add(data);
    const url = `https://nfts-market.infura-ipfs.io/ipfs/${added.path}`;
    /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export { uploadImageToIPFS, uploadNFTWithMetadataToIPFS };
