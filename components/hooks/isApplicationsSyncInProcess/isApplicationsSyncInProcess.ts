import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useIsApplicationsSyncInProcess = () => {
  const applicationsGetCollections = useSelector(
    (state: RootState) =>
      state.getCollectionApplications.applicationsGetCollectionState
  );

  const isApplicationsGetCollectionInProcess = useMemo(() => {
    return Object.keys(applicationsGetCollections).some(
      (applicationPostKey) =>
        applicationsGetCollections[applicationPostKey]?.isInProcess
    );
  }, [applicationsGetCollections]);

  const applicationsPosts = useSelector(
    (state: RootState) => state.postApplication.postApplicationState
  );

  const isApplicationsPostInProcess = useMemo(() => {
    return Object.keys(applicationsPosts).some(
      (applicationPostKey) => applicationsPosts[applicationPostKey]?.isInProcess
    );
  }, [applicationsPosts]);

  const applicationsPatchs = useSelector(
    (state: RootState) => state.patchApplication.patchApplicationState
  );

  const isApplicationsPatchInProcess = useMemo(() => {
    return Object.keys(applicationsPatchs).some(
      (applicationPatchKey) =>
        applicationsPatchs[applicationPatchKey]?.isInProcess
    );
  }, [applicationsPatchs]);

  const isSyncInProcess = useMemo(() => {
    return (
      isApplicationsGetCollectionInProcess ||
      isApplicationsPostInProcess ||
      isApplicationsPatchInProcess
    );
  }, [
    isApplicationsGetCollectionInProcess,
    isApplicationsPostInProcess,
    isApplicationsPatchInProcess,
  ]);

  return isSyncInProcess;
};
