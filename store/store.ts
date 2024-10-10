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
import getCollectionEquipmentsReducer from "@/store/equipments/getCollection/getCollection";
import stateEquipmentsReducer from "@/store/equipments/state/state";
import postEquipmentReducer from "@/store/equipments/post/post";
import patchEquipmentReducer from "@/store/equipments/patch/patch";

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

const getCollectionEquipmentsPersistConfig = {
  key: "getCollectionEquipments",
  storage,
};

const stateEquipmentsPersistConfig = {
  key: "stateEquipments",
  storage,
};

const postEquipmentPersistConfig = {
  key: "postEquipment",
  storage,
};

const patchEquipmentPersistConfig = {
  key: "patchEquipment",
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

const persistedGetCollectionEquipmentsReducer = persistReducer(
  getCollectionEquipmentsPersistConfig,
  getCollectionEquipmentsReducer
);

const persistedStateEquipmentsReducer = persistReducer(
  stateEquipmentsPersistConfig,
  stateEquipmentsReducer
);

const persistedPostEquipmentReducer = persistReducer(
  postEquipmentPersistConfig,
  postEquipmentReducer
);

const persistedPatchEquipmentReducer = persistReducer(
  patchEquipmentPersistConfig,
  patchEquipmentReducer
);

const store = configureStore({
  reducer: {
    postLogin: persistedPostLoginReducer,
    stateNavigation: persistedStateNavigationReducer,
    getCollectionInstallers: persistedGetCollectionInstallersReducer,
    stateInstallers: persistedStateInstallersReducer,
    postInstaller: persistedPostInstallerReducer,
    patchInstaller: persistedPatchInstallerReducer,
    getCollectionEquipments: persistedGetCollectionEquipmentsReducer,
    stateEquipments: persistedStateEquipmentsReducer,
    postEquipment: persistedPostEquipmentReducer,
    patchEquipment: persistedPatchEquipmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

//\persistor.purge();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
