import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useIsEquipmentsSyncInProcess = () => {
  const equipmentsGetCollections = useSelector(
    (state: RootState) =>
      state.getCollectionEquipments.equipmentsGetCollectionState
  );

  const isEquipmentsGetCollectionInProcess = useMemo(() => {
    return Object.keys(equipmentsGetCollections).some(
      (equipmentPostKey) =>
        equipmentsGetCollections[equipmentPostKey]?.isInProcess
    );
  }, [equipmentsGetCollections]);

  const equipmentsPosts = useSelector(
    (state: RootState) => state.postEquipment.postEquipmentState
  );

  const isEquipmentsPostInProcess = useMemo(() => {
    return Object.keys(equipmentsPosts).some(
      (equipmentPostKey) => equipmentsPosts[equipmentPostKey]?.isInProcess
    );
  }, [equipmentsPosts]);

  const equipmentsPatchs = useSelector(
    (state: RootState) => state.patchEquipment.patchEquipmentState
  );

  const isEquipmentsPatchInProcess = useMemo(() => {
    return Object.keys(equipmentsPatchs).some(
      (equipmentPatchKey) => equipmentsPatchs[equipmentPatchKey]?.isInProcess
    );
  }, [equipmentsPatchs]);

  const isSyncInProcess = useMemo(() => {
    return (
      isEquipmentsGetCollectionInProcess ||
      isEquipmentsPostInProcess ||
      isEquipmentsPatchInProcess
    );
  }, [
    isEquipmentsGetCollectionInProcess,
    isEquipmentsPostInProcess,
    isEquipmentsPatchInProcess,
  ]);

  return isSyncInProcess;
};
