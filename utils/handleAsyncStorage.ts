import AsyncStorage from "@react-native-async-storage/async-storage";

const setItemInAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

const removeItemFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

const getItemFromAsyncStorage = async (key: string) => {
  const item = await AsyncStorage.getItem(key);
  return item ? item : null;
};
export {
  setItemInAsyncStorage,
  removeItemFromAsyncStorage,
  getItemFromAsyncStorage,
};
