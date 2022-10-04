import React, { useState } from "react";
import {
  Text,
  Heading,
  VStack,
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

const SignIn = ({
  handleAuthScreenChange,
  navigation,
}: {
  handleAuthScreenChange: (screen: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loginError } = useStore();
  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email"),
    password: Yup.string().required("Password is required"),
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
    signIn(data, navigation);
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
        Login
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
        Sign In to continue!
      </Heading>
      <VStack space={3} mt="5" onSubmit={handleSubmit(onSubmit)}>
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

        <Button mt="2" colorScheme="indigo" onPress={handleSubmit(onSubmit)}>
          Sign In
        </Button>
        <Text
          fontSize="sm"
          onPress={() => {
            handleAuthScreenChange("signUp");
          }}
        >
          SignUp
        </Text>
        <Text fontSize="sm">{loginError}</Text>
      </VStack>
    </View>
  );
};

export default SignIn;
