import React, { useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  Button,
  useToast,
  Center,
  Container,
  Text,
  Box,
} from "native-base";

import { View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useStore } from "../../store";
import { uploadToIPFS } from "../../utils/ipfsClient";
import { ethers } from "ethers";
import { marketplaceAddress, marketplaceJSON } from "../../config";
import Toaster from "../../components/Toaster";
import ConnectWalletAlert from "../../components/ConnectWalletAlert";

// import { create as ipfsHttpClient } from "ipfs-http-client";

const CreateNFT = () => {
  const [imageURL, setImageURL] = useState();
  const { connector, provider, signer } = useStore();
  const toast = useToast();

  const CreateNFTSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.cancelled) {
      return;
    }

    const base64 = result.base64;
    const imageURL = await uploadToIPFS(base64);
    setImageURL(imageURL);
  };

  async function listNFTForSale(formData) {
    const { name, description, price } = formData;

    const data = {
      name,
      description,
      image: imageURL,
    };

    const contentURL = await uploadToIPFS(data);

    const priceInETH = ethers.utils.parseUnits(price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      marketplaceJSON.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(contentURL, priceInETH, {
      value: listingPrice,
    });
    await transaction.wait();

    toast.show({
      render: () => {
        return <Toaster statement="NFT created successfully" />;
      },
    });
  }

  if (!connector?.connected) {
    return (
      <ConnectWalletAlert alertText="Please attach your wallet to create NFT" />
    );
  }

  return (
    <Box px={6}>
      <VStack space={2} justifyContent="space-between" h="100%" py={5}>
        <VStack space={4} my={4}>
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
                  placeholder="Description"
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
                  keyboardType="numeric"
                />
              )}
              name="price"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.name?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={pickImage} borderRadius={50}>
            Pick Image
          </Button>
          {/* {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )} */}
        </VStack>

        <Button onPress={handleSubmit(listNFTForSale)} borderRadius={50}>
          List NFT
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateNFT;
