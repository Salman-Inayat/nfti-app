import React, { useState } from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  VStack,
  Box,
  FormControl,
  Input,
  Button,
  IconButton,
  Icon,
} from "native-base";
import { View } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { MaterialIcons } from "@expo/vector-icons";

import { useStore } from "../../store";

const SignUp = ({ handleAuthScreenChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signUpError } = useStore();
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("First name is required")
      .min(3, "Minimum 3 characters"),
    // lastName: Yup.string()
    //   .required("Last name is required")
    //   .min(3, "Minimum 3 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email"),
    password: Yup.string()
      .required("Password is required")
      .min(3, "Password must be at 3 char long"),

    //   .matches(
    //     /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()"'.,<>;:`~|?-_]))(?=.{8,})/,
    //     "Must contain 8 characters, one small letter,one capital letter, one number and one special case Character"
    //   ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Password does not match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Calling store function on submit");
    signUp(data);
  };

  return (
    <View>
      <Heading
        size="lg"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
        fontWeight="semibold"
      >
        Welcome
      </Heading>
      <Heading
        mt="1"
        color="coolGray.600"
        _dark={{
          color: "warmGray.200",
        }}
        fontWeight="medium"
        size="xs"
      >
        Sign up to continue!
      </Heading>
      <VStack space={3} mt="5" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={"name" in errors}>
          <FormControl.Label>First Name</FormControl.Label>
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
        <FormControl isInvalid={"email" in errors}>
          <FormControl.Label>Email</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="Email Address"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.email?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={"password" in errors}>
          <FormControl.Label>Password</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="********"
                onChangeText={onChange}
                value={value}
                type={showPassword ? "text" : "password"}
                InputRightElement={
                  <IconButton
                    icon={
                      <Icon
                        as={MaterialIcons}
                        name={showPassword ? "visibility" : "visibility-off"}
                      />
                    }
                    size={5}
                    mr="2"
                    _icon={{
                      color: "gray.500",
                      size: "lg",
                    }}
                    _hover={{
                      bg: "gray.600:alpha.20",
                    }}
                    _pressed={{
                      bg: "gray.600:alpha.20",
                      _icon: {
                        name: "emoji-flirt",
                      },
                      _ios: {
                        _icon: {
                          size: "2xl",
                        },
                      },
                    }}
                    _ios={{
                      _icon: {
                        size: "2xl",
                      },
                    }}
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                }
              />
            )}
            name="password"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.password?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={"confirmPassword" in errors}>
          <FormControl.Label>Confirm Password</FormControl.Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                placeholder="********"
                onChangeText={onChange}
                value={value}
                type={showPassword ? "text" : "password"}
              />
            )}
            name="confirmPassword"
            defaultValue=""
          />
          <FormControl.ErrorMessage>
            {errors.confirmPassword?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button mt="2" colorScheme="indigo" onPress={handleSubmit(onSubmit)}>
          Sign up
        </Button>

        <Text
          fontSize="sm"
          onPress={() => {
            handleAuthScreenChange("signIn");
          }}
        >
          SignIn
        </Text>
        <Text
          fontSize="sm"
          onPress={() => {
            handleAuthScreenChange("signIn");
          }}
        >
          {signUpError}
        </Text>
      </VStack>
    </View>
  );
};

export default SignUp;
