import React, { useEffect, useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  Button,
  useToast,
  TextArea,
  Text,
  Box,
  Image,
  Skeleton,
} from "native-base";

import * as ImagePicker from "expo-image-picker";
import { ScrollView, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useStore } from "../../store";
import { uploadToIPFS } from "../../utils/ipfsClient";
import { ethers } from "ethers";
import { marketplaceAddress, marketplaceJSON } from "../../config";
import ConnectWalletAlert from "../../components/ConnectWalletAlert";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from "@react-navigation/native";
import { primaryColor } from "../../theme/colors";
import Loader from "../../components/Loader";

const CreateNFT = ({ navigation }: { navigation: any }) => {
  const [imageURL, setImageURL] = useState("");
  const { connector, provider, signer } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const CreateNFTSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });

  useFocusEffect(
    React.useCallback(() => {
      setImageURL("");
      clearErrors();
      reset();
    }, [])
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
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
    setIsImageUploading(true);
    const imageURL = await uploadToIPFS(base64!);
    console.log(imageURL);
    setImageURL(imageURL);
    setIsImageUploading(false);
  };

  async function listNFTForSale(formData: any) {
    // setIsCreating(true)
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
    setIsCreating(true);
    await transaction.wait();
    setIsCreating(false);

    navigation.navigate("Dashboard", {
      screen: "NFTs",
      params: {
        screen: "Home",
      },
    });
  }

  if (!connector?.connected) {
    return (
      <ConnectWalletAlert alertText="Please attach your wallet to create NFT" />
    );
  }

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
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
                  <TextArea
                    onBlur={onBlur}
                    placeholder="Description"
                    onChangeText={onChange}
                    value={value}
                    h={40}
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
                {errors.price?.message}
              </FormControl.ErrorMessage>
            </FormControl>
            <Button onPress={pickImage} borderRadius={50}>
              Pick Image
            </Button>
            <Box display="flex" justifyContent="center" alignItems="center">
              {imageURL !== "" && !isImageUploading ? (
                <Image
                  source={{ uri: imageURL }}
                  style={{ width: 200, height: 200 }}
                  borderRadius={10}
                  alt="nft-image"
                />
              ) : (
                isImageUploading && (
                  <Skeleton borderRadius={10} height={200} width={200} />
                )
              )}
            </Box>
          </VStack>

          <Button onPress={handleSubmit(listNFTForSale)} borderRadius={50}>
            List NFT
          </Button>
        </VStack>
      </Box>

      <Loader loading={isCreating} text="Uploading NFT to marketplace" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default CreateNFT;
