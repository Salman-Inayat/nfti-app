import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Container,
} from "native-base";

import { View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useStore } from "../../store";
import {
  // client,
  uploadImageToIPFS,
  uploadNFTWithMetadataToIPFS,
} from "../../utils/ipfsClient";
import { create as ipfsHttpClient } from "ipfs-http-client";

const CreateNFT = () => {
  const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${Buffer.from(
        process.env.INFURA_IPFS_PROJECT_ID +
          ":" +
          process.env.INFURA_IPFS_SECRET_KEY
      ).toString("base64")}`,
    },
  });
  const [image, setImage] = useState();

  // const { uploadNFT } = useStore();

  const CreateNFTSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
    imageUrl: Yup.string().required("Image is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(CreateNFTSchema),
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
    } else {
      return;
    }

    await uploadImageToIPFS(client, result);

    // // ImagePicker saves the taken photo to disk and returns a local URI to it
    // let localUri = result.uri;
    // let filename = localUri.split("/").pop();

    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    // // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // // Assume "photo" is the name of the form field the server expects
    // formData.append("photo", { uri: localUri, name: filename, type });

    // await uploadNFT(formData);
  };

  async function listNFTForSale(data) {
    const url = await uploadNFTWithMetadataToIPFS(client, data, image);

    // const web3 = new Web3Modal();
    // const connection = await web3.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();

    // /* create the NFT */
    // const price = ethers.utils.parseUnits(data.price, "ether");
    // let contract = new ethers.Contract(
    //   marketplaceAddress,
    //   NFTMarketplace.abi,
    //   signer
    // );
    // let listingPrice = await contract.getListingPrice();
    // listingPrice = listingPrice.toString();
    // let transaction = await contract.createToken(url, price, {
    //   value: listingPrice,
    // });
    // await transaction.wait();
    // router.push("/");
  }

  return (
    <View>
      <VStack space={3} mt="5">
        <FormControl isInvalid={"name" in errors}>
          <FormControl.Label>Name</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="Name"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.name?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={"description" in errors}>
          <FormControl.Label>Description</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="Descriotion"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.description?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={"price" in errors}>
          <FormControl.Label>Price</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="Price"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="price"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.name?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button onPress={pickImage}>Pick Image</Button>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}

        <Button
          mt="2"
          colorScheme="indigo"
          onPress={handleSubmit(listNFTForSale)}
        >
          List NFT
        </Button>
      </VStack>
    </View>
  );
};

export default CreateNFT;
