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
import { postApplication } from "@/store/applications/post/post";
import { patchApplication } from "@/store/applications/patch/patch";
import { getPoolsCollection } from "@/store/pools/getCollection/getCollection";
import { patchPool } from "@/store/pools/patch/patch";
import { getApplicationsCollection } from "./store/applications/getCollection/getCollection";

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

    const equipmentId = pageParams?.[page]?.id;
    const equipmentDraftId = pageParams?.[page]?.draftId;

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

  const applicationsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolsList = useSelector(
    (state: RootState) => state.stateApplications.applications.data
  );

  const poolCurrentPage = useSelector(
    (state: RootState) => state.stateApplications.currentPage.data
  );

  const poolData = useMemo(() => {
    if (!["AdminApplicationsPoolPage"].includes(page)) return;

    const poolId = pageParams?.id;
    const poolDraftId = pageParams?.draftId;

    return poolsList.find((pool) => {
      if (!!pool?.id && !!poolId && pool.id == poolId) return true;

      if (!!pool?.draftId && !!poolDraftId && pool?.draftId == poolDraftId)
        return true;

      return false;
    });
  }, [poolsList, pageParams, page]);

  // Use refs to hold the latest values
  const installersListRef = useRef(installersList);
  const equipmentsListRef = useRef(equipmentsList);
  const applicationsListRef = useRef(applicationsList);
  const poolsListRef = useRef(poolsList);
  const isConnectedRef = useRef(isConnected);
  const pageRef = useRef(page);
  const equipmentDataRef = useRef(equipmentData);
  const equipmentCurrentPageRef = useRef(equipmentCurrentPage);
  const poolDataRef = useRef(poolData);
  const poolCurrentPageRef = useRef(poolCurrentPage);

  useEffect(() => {
    installersListRef.current = installersList;
    equipmentsListRef.current = equipmentsList;
    applicationsListRef.current = applicationsList;
    poolsListRef.current = poolsList;
    isConnectedRef.current = isConnected;
    pageRef.current = page;
    equipmentDataRef.current = equipmentData;
    equipmentCurrentPageRef.current = equipmentCurrentPage;
    poolDataRef.current = poolData;
    poolCurrentPageRef.current = poolCurrentPage;
  }, [
    installersList,
    equipmentsList,
    applicationsList,
    poolsList,
    isConnected,
    page,
    equipmentData,
    equipmentCurrentPage,
    poolData,
    poolCurrentPage,
  ]);

  // Sync all the data with the server
  const syncData = useCallback(async () => {
    if (!isConnectedRef.current) return;
    if (!pageRef.current) return;

    if (
      [
        "AdminApplicationsPoolsPage",
        "AdminApplicationsPoolPage",
        "AdminApplicationPage",
        "AdminInstallersPage",
        "AdminInstallerPage",
      ].includes(pageRef.current)
    ) {
      // Get current state of installers collection
      await dispatch(getInstallersCollection());

      // Post all draft installers
      for (const installer of installersListRef.current) {
        // If have id, draft is for backward compatibility of navigation
        if (installer?.id) continue;
        if (!installer?.draftId) continue;

        await dispatch(postInstaller({ id: installer?.draftId }));
      }

      // Patch all modified installers
      for (const installer of installersListRef.current) {
        // Should have id and be modified
        if (!installer?.id) continue;
        if (!installer?.isModified) continue;

        await dispatch(patchInstaller({ id: installer?.id }));
      }
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
          : { page: 1 };

      // Get current state of equipments collection
      await dispatch(getEquipmentsCollection(params));

      // Post all draft equipments
      for (const equipment of equipmentsListRef.current) {
        // If have id, draft is for backward compatibility of navigation
        if (equipment?.id) continue;
        if (!equipment?.draftId) continue;

        await dispatch(postEquipment({ id: equipment?.draftId }));
      }

      // Patch all modified equipments
      for (const equipment of equipmentsListRef.current) {
        // Should have id and be modified
        if (!equipment?.id) continue;
        if (!equipment?.isModified) continue;

        await dispatch(patchEquipment({ id: equipment?.id }));
      }
    }

    if (
      [
        "AdminApplicationsPoolsPage",
        "AdminApplicationsPoolPage",
        "AdminApplicationPage",
      ].includes(pageRef.current)
    ) {
      // Set page of application if it is application page
      const params =
        ["AdminApplicationsPoolPage"].includes(pageRef.current) &&
        poolDataRef.current?.page
          ? { page: poolDataRef.current?.page }
          : poolCurrentPageRef.current
          ? { page: poolCurrentPageRef.current }
          : { page: 1 };

      // Get current state of applications collection
      await dispatch(getPoolsCollection(params));

      // Post all draft applications
      for (const application of applicationsListRef.current) {
        // If have id, draft is for backward compatibility of navigation
        if (application?.id) continue;
        if (!application?.draftId) continue;

        if (
          !application.poolId &&
          !!application.poolDraftId &&
          !application.isApplicationCanBePushed
        ) {
          continue;
        }

        //  If have poolId, it's ok to push
        //  If don't have poolDraftId, it will create new poolId, it's ok to push
        //  If can be push it's the only one with new poolDraftId, it's ok to push
        await dispatch(postApplication({ id: application?.draftId }));
      }

      // Patch all modified applications
      for (const application of applicationsListRef.current) {
        // Should have id and be modified
        if (!application?.id) continue;
        if (!application?.isModified) continue;

        await dispatch(patchApplication({ id: application?.id }));
      }

      // Patch all modified pools
      for (const pool of poolsListRef.current) {
        // Should have id and be modified
        if (!pool?.id) continue;
        if (!pool?.isModified) continue;

        await dispatch(patchPool({ id: pool?.id }));
      }
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
    }, 20 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncData]);

  return <>{children}</>;
}
