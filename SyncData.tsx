import { ReactNode, useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import NetInfo from "@react-native-community/netinfo";
import debounce from "lodash.debounce";
import { postInstaller } from "@/store/installers/post/post";
import {
  setAccessToken,
  setRefreshToken,
} from "@/store/navigation/state/state";
import { getInstallersCollection } from "@/store/installers/getCollection/getCollection";

interface ContentProps {
  children?: ReactNode;
}

export default function SyncData({ children }: ContentProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  //  Sync all the data with the server
  const syncData = useCallback(async () => {
    if (!isConnected) return;

    //  Get current state of installers collection
    await dispatch(getInstallersCollection());

    //  Post all draft installers
    installersList.forEach(async (installer, index) => {
      if (!installer?.draftId) return;

      await dispatch(postInstaller({ id: installer?.draftId }));
    });
  }, [dispatch, installersList, isConnected]);

  // Debounce
  const handleConnectivityChange = debounce(async (state: any) => {
    if (!state.isConnected) {
      setIsConnected(false);
      return;
    }

    setIsConnected(true);
  }, 500);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      handleConnectivityChange(state);
    });

    return () => {
      unsubscribe();
      handleConnectivityChange.cancel();
    };
  }, []);

  useEffect(() => {
    syncData();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      syncData();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncData]);

  return <>{children}</>;
}
