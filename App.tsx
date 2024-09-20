import React, { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store, persistor } from "./store/store";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { NavigationProvider, RootStackParamList } from "@/NavigationContext";
import AppContent from "@/AppContent";

const App = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <NavigationProvider navigationRef={navigationRef}>
              <AppContent />
            </NavigationProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
