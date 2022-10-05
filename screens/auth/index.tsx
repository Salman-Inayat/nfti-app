import React, { useState } from "react";
import SignIn from "./signIn";
import SignUp from "./signUp";

import {
  Link,
  HStack,
  Center,
  Heading,
  VStack,
  Box,
  Image,
  Container,
  View,
} from "native-base";

const AuthScreen = ({ navigation }) => {
  const [authScreen, setAuthScreen] = useState("signIn");

  const handleAuthScreenChange = (screen: React.SetStateAction<string>) => {
    setAuthScreen(screen);
  };
  return (
    <View width="100%" p="20">
      <VStack space={4} alignItems="center" width="100%">
        <Container centerContent height="20%" width="100%">
          <Image
            source={{
              uri: "https://wallpaperaccess.com/full/317501.jpg",
            }}
            width="100px"
            height="100px"
            alt="Alternate Text"
            size="xl"
          />
        </Container>
        <Container centerContent height="70%" width="100%" pt="10">
          {authScreen === "signIn" ? (
            <SignIn
              handleAuthScreenChange={handleAuthScreenChange}
              navigation={navigation}
            />
          ) : (
            <SignUp
              handleAuthScreenChange={handleAuthScreenChange}
              navigation={navigation}
            />
          )}
        </Container>
      </VStack>
    </View>
  );
};

export default AuthScreen;
