import { configurePersist } from "zustand-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";

const { persist, purge } = configurePersist({
  storage: AsyncStorage,
});

export default persist;
export { purge };
