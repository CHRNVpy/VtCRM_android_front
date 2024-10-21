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
import getCollectionApplicationsReducer from "@/store/applications/getCollection/getCollection";
import stateApplicationsReducer from "@/store/applications/state/state";
import postApplicationReducer from "@/store/applications/post/post";
import patchApplicationReducer from "@/store/applications/patch/patch";
import getCollectionPoolsReducer from "@/store/pools/getCollection/getCollection";
import statePoolsReducer from "@/store/pools/state/state";
import patchPoolReducer from "@/store/pools/patch/patch";

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

const getCollectionApplicationsPersistConfig = {
  key: "getCollectionApplications",
  storage,
};

const stateApplicationsPersistConfig = {
  key: "stateApplications",
  storage,
};

const postApplicationPersistConfig = {
  key: "postApplication",
  storage,
};

const patchApplicationPersistConfig = {
  key: "patchApplication",
  storage,
};

const getCollectionPoolsPersistConfig = {
  key: "getCollectionPools",
  storage,
};

const statePoolsPersistConfig = {
  key: "statePools",
  storage,
};

const patchPoolPersistConfig = {
  key: "patchPool",
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

const persistedGetCollectionApplicationsReducer = persistReducer(
  getCollectionApplicationsPersistConfig,
  getCollectionApplicationsReducer
);

const persistedStateApplicationsReducer = persistReducer(
  stateApplicationsPersistConfig,
  stateApplicationsReducer
);

const persistedPostApplicationReducer = persistReducer(
  postApplicationPersistConfig,
  postApplicationReducer
);

const persistedPatchApplicationReducer = persistReducer(
  patchApplicationPersistConfig,
  patchApplicationReducer
);

const persistedGetCollectionPoolsReducer = persistReducer(
  getCollectionPoolsPersistConfig,
  getCollectionPoolsReducer
);

const persistedStatePoolsReducer = persistReducer(
  statePoolsPersistConfig,
  statePoolsReducer
);

const persistedPatchPoolReducer = persistReducer(
  patchPoolPersistConfig,
  patchPoolReducer
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
    getCollectionApplications: persistedGetCollectionApplicationsReducer,
    stateApplications: persistedStateApplicationsReducer,
    postApplication: persistedPostApplicationReducer,
    patchApplication: persistedPatchApplicationReducer,
    getCollectionPools: persistedGetCollectionPoolsReducer,
    statePools: persistedStatePoolsReducer,
    patchPool: persistedPatchPoolReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

//persistor.purge();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
