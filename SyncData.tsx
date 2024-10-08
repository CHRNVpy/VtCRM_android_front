import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import NetInfo from "@react-native-community/netinfo";
import debounce from "lodash.debounce";
import { postInstaller } from "@/store/installers/post/post";
import { patchInstaller } from "@/store/installers/patch/patch";
import { getInstallersCollection } from "@/store/installers/getCollection/getCollection";
import { postEquipment } from "@/store/equipments/post/post";
import { patchEquipment } from "@/store/equipments/patch/patch";
import { getEquipmentsCollection } from "@/store/equipments/getCollection/getCollection";

interface ContentProps {
  children?: ReactNode;
}

export default function SyncData({ children }: ContentProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const page = useSelector(
    (state: RootState) => state.stateNavigation.page.data
  );

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const equipmentsList = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const equipmentCurrentPage = useSelector(
    (state: RootState) => state.stateEquipments.currentPage.data
  );

  const equipmentData = useMemo(() => {
    if (!["AdminEquipmentPage"].includes(page)) return;

    const equipmentId = pageParams?.id;
    const equipmentDraftId = pageParams?.draftId;

    return equipmentsList.find((equipment) => {
      if (!!equipment?.id && !!equipmentId && equipment.id == equipmentId)
        return true;

      if (
        !!equipment?.draftId &&
        !!equipmentDraftId &&
        equipment?.draftId == equipmentDraftId
      )
        return true;

      return false;
    });
  }, [equipmentsList, pageParams, page]);

  // Use refs to hold the latest values
  const installersListRef = useRef(installersList);
  const equipmentsListRef = useRef(equipmentsList);
  const isConnectedRef = useRef(isConnected);
  const pageRef = useRef(page);
  const equipmentDataRef = useRef(equipmentData);
  const equipmentCurrentPageRef = useRef(equipmentCurrentPage);

  useEffect(() => {
    installersListRef.current = installersList;
    equipmentsListRef.current = equipmentsList;
    isConnectedRef.current = isConnected;
    pageRef.current = page;
    equipmentDataRef.current = equipmentData;
    equipmentCurrentPageRef.current = equipmentCurrentPage;
  }, [
    installersList,
    equipmentsList,
    isConnected,
    page,
    equipmentData,
    equipmentCurrentPage,
  ]);

  // Sync all the data with the server
  const syncData = useCallback(async () => {
    if (!isConnectedRef.current) return;
    if (!pageRef.current) return;

    if (
      ["AdminInstallersPage", "AdminInstallerPage"].includes(pageRef.current)
    ) {
      // Get current state of installers collection
      await dispatch(getInstallersCollection());

      // Post all draft installers
      installersListRef.current.forEach(async (installer) => {
        // If have id, draft is for backward compatibility of navigation
        if (installer?.id) return;
        if (!installer?.draftId) return;

        await dispatch(postInstaller({ id: installer?.draftId }));
      });

      // Patch all modified installers
      installersListRef.current.forEach(async (installer) => {
        // Should have id and be modified
        if (!installer?.id) return;
        if (!installer?.isModified) return;

        await dispatch(patchInstaller({ id: installer?.id }));
      });
    }

    if (
      ["AdminEquipmentsPage", "AdminEquipmentPage"].includes(pageRef.current)
    ) {
      // Set page of equipment if it is equipment page
      const params =
        ["AdminEquipmentPage"].includes(pageRef.current) &&
        equipmentDataRef.current?.page
          ? { page: equipmentDataRef.current?.page }
          : equipmentCurrentPageRef.current
          ? { page: equipmentCurrentPageRef.current }
          : undefined;

      // Get current state of equipments collection
      await dispatch(getEquipmentsCollection(params));

      // Post all draft equipments
      equipmentsListRef.current.forEach(async (equipment) => {
        // If have id, draft is for backward compatibility of navigation
        if (equipment?.id) return;
        if (!equipment?.draftId) return;

        await dispatch(postEquipment({ id: equipment?.draftId }));
      });

      // Patch all modified equipments
      equipmentsListRef.current.forEach(async (equipment) => {
        // Should have id and be modified
        if (!equipment?.id) return;
        if (!equipment?.isModified) return;

        await dispatch(patchEquipment({ id: equipment?.id }));
      });
    }
  }, [dispatch]);

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

  // Set interval to sync data
  useEffect(() => {
    syncData(); // Initial call

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      syncData();
    }, 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncData]);

  return <>{children}</>;
}
