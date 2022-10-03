/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Own: {
            screens: {
              OwnNFTsScreen: "own",
            },
          },
          Create: {
            screens: {
              CreateNFTScreen: "create",
            },
          },
          Transactions: {
            screens: {
              TransactionsScreen: "transactions",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "profile",
            },
          },
        },
      },
    },
  },
};

export default linking;
