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
      ["AdminInstallersPage", "AdminInstallerPage"].includes(pageRef.current)
    ) {
      // Get current state of installers collection
      await dispatch(getInstallersCollection());

      // Post all draft installers
      installersListRef.current.forEach((installer) => {
        // If have id, draft is for backward compatibility of navigation
        if (installer?.id) return;
        if (!installer?.draftId) return;

        dispatch(postInstaller({ id: installer?.draftId }));
      });

      // Patch all modified installers
      installersListRef.current.forEach((installer) => {
        // Should have id and be modified
        if (!installer?.id) return;
        if (!installer?.isModified) return;

        dispatch(patchInstaller({ id: installer?.id }));
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
          : { page: 1 };

      // Get current state of equipments collection
      await dispatch(getEquipmentsCollection(params));

      // Post all draft equipments
      equipmentsListRef.current.forEach((equipment) => {
        // If have id, draft is for backward compatibility of navigation
        if (equipment?.id) return;
        if (!equipment?.draftId) return;

        dispatch(postEquipment({ id: equipment?.draftId }));
      });

      // Patch all modified equipments
      equipmentsListRef.current.forEach((equipment) => {
        // Should have id and be modified
        if (!equipment?.id) return;
        if (!equipment?.isModified) return;

        dispatch(patchEquipment({ id: equipment?.id }));
      });
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

      const poolDraftIdsAlreadyPosted: number[] = [];

      // Post all draft applications
      applicationsListRef.current.forEach((application) => {
        // If have id, draft is for backward compatibility of navigation
        if (application?.id) return;
        if (!application?.draftId) return;

        //  Prevent to push several applications with the same poolDraftId
        if (application.poolDraftId) {
          if (poolDraftIdsAlreadyPosted.includes(application.poolDraftId))
            return;

          poolDraftIdsAlreadyPosted.push(application.poolDraftId);
        }

        dispatch(postApplication({ id: application?.draftId }));
      });

      // Patch all modified applications
      applicationsListRef.current.forEach((application) => {
        // Should have id and be modified
        if (!application?.id) return;
        if (!application?.isModified) return;

        dispatch(patchApplication({ id: application?.id }));
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
    }, 20 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncData]);

  return <>{children}</>;
}
