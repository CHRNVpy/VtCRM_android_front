import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useIsInstallersSyncInProcess = () => {
  const isInstallersGetCollectionInProcess = useSelector(
    (state: RootState) =>
      state.getCollectionInstallers.installersGetCollectionState.isInProcess
  );

  const installersPosts = useSelector(
    (state: RootState) => state.postInstaller.postInstallerState
  );

  const isInstallersPostInProcess = useMemo(() => {
    return Object.keys(installersPosts).some(
      (installerPostKey) => installersPosts[installerPostKey]?.isInProcess
    );
  }, [installersPosts]);

  const installersPatchs = useSelector(
    (state: RootState) => state.patchInstaller.patchInstallerState
  );

  const isInstallersPatchInProcess = useMemo(() => {
    return Object.keys(installersPatchs).some(
      (installerPatchKey) => installersPatchs[installerPatchKey]?.isInProcess
    );
  }, [installersPatchs]);

  const isSyncInProcess = useMemo(() => {
    return (
      isInstallersGetCollectionInProcess ||
      isInstallersPostInProcess ||
      isInstallersPatchInProcess
    );
  }, [
    isInstallersGetCollectionInProcess,
    isInstallersPostInProcess,
    isInstallersPatchInProcess,
  ]);

  return isSyncInProcess;
};
