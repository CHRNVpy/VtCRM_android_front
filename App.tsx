import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store, persistor } from "./store/store";
import AppContent from "./AppContent";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

export default App;
