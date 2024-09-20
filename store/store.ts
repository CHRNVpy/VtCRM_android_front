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

const persistConfig = {
  key: "root",
  storage,
};

const persistedPostLoginReducer = persistReducer(
  persistConfig,
  postLoginReducer
);

const persistedStateNavigationReducer = persistReducer(
  persistConfig,
  stateNavigationReducer
);

const store = configureStore({
  reducer: {
    postLogin: persistedPostLoginReducer,
    stateNavigation: persistedStateNavigationReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
