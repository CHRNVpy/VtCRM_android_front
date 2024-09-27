import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@react-native-async-storage/async-storage"; // AsyncStorage для React Native
import postLoginReducer from "@/store/login/post/post";
import stateNavigationReducer from "@/store/navigation/state/state";
import getCollectionInstallersReducer from "@/store/installers/getCollection/getCollection";
import stateInstallersReducer from "@/store/installers/state/state";

const postLoginPersistConfig = {
  key: "postLogin",
  storage,
};

const stateNavigationPersistConfig = {
  key: "stateNavigation",
  storage,
};

const getCollectionInstallersPersistConfig = {
  key: "getCollectionInstallers",
  storage,
};

const stateInstallersPersistConfig = {
  key: "stateInstallers",
  storage,
};

const persistedPostLoginReducer = persistReducer(
  postLoginPersistConfig,
  postLoginReducer
);

const persistedStateNavigationReducer = persistReducer(
  stateNavigationPersistConfig,
  stateNavigationReducer
);

const persistedGetCollectionInstallersReducer = persistReducer(
  getCollectionInstallersPersistConfig,
  getCollectionInstallersReducer
);

const persistedStateInstallersReducer = persistReducer(
  stateInstallersPersistConfig,
  stateInstallersReducer
);

const store = configureStore({
  reducer: {
    postLogin: persistedPostLoginReducer,
    stateNavigation: persistedStateNavigationReducer,
    getCollectionInstallers: persistedGetCollectionInstallersReducer,
    stateInstallers: persistedStateInstallersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: [
          "payload.ajaxCancel",
          "meta.arg.reducerAction",
          "meta.arg.getDataFromStateFunction",
          "meta.arg.urlFromStateFunction",
          "meta.arg.callbackAfterPost",
          "meta.arg.callbackAfterPatch",
          "meta.arg.setAccessToken",
          "meta.arg.setRefreshToken",
        ],
        ignoredPaths: ["postLogin.postLoginState"],
      },
    }),
});

const persistor = persistStore(store);

//persistor.purge();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
