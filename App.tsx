import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store, persistor } from "@/store/store";
import NavigationContainer from "@/NavigationContainer";
import SyncData from "@/SyncData";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

const App = () => {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SyncData>
            <NavigationContainer />
          </SyncData>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
