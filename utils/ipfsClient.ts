import axios from "axios";

export const uploadToIPFS = async (
  content:
    | string
    | {
        name: string;
        description: string;
        image: string;
      }
) => {
  const options = {
    method: "POST",
    url: "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-API-Key":
        "wqWeaqqfbDvyuG4iP9SPk7rLwuNamT0lMgqsznPagFnJUGLeN7z0PSYbIsokgxE4",
    },
    data: [
      {
        content: content,
        path: "sdasdsaddasewirjewirjewkrlem",
      },
    ],
  };

  const response = await axios.request(options);
  return response.data[0].path;
};
