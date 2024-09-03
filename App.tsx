import React from "react";
import { Text } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import AppContent from "./AppContent";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
