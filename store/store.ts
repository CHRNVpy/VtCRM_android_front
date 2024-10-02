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
import postInstallerReducer from "@/store/installers/post/post";
import patchInstallerReducer from "@/store/installers/patch/patch";

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

const postInstallerPersistConfig = {
  key: "postInstaller",
  storage,
};

const patchInstallerPersistConfig = {
  key: "patchInstaller",
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

const persistedPostInstallerReducer = persistReducer(
  postInstallerPersistConfig,
  postInstallerReducer
);

const persistedPatchInstallerReducer = persistReducer(
  patchInstallerPersistConfig,
  patchInstallerReducer
);

const store = configureStore({
  reducer: {
    postLogin: persistedPostLoginReducer,
    stateNavigation: persistedStateNavigationReducer,
    getCollectionInstallers: persistedGetCollectionInstallersReducer,
    stateInstallers: persistedStateInstallersReducer,
    postInstaller: persistedPostInstallerReducer,
    patchInstaller: persistedPatchInstallerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["payload", "meta.arg"],
        ignoredPaths: [
          "postLogin.postLoginState",
          "postInstaller.postInstallerState",
          "patchInstaller.patchInstallerState",
          "getCollectionInstallers.installersGetCollectionState",
        ],
      },
    }),
});

const persistor = persistStore(store);

//persistor.purge();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
