import { TextInput } from "react-native";
import { useMemo, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";
import { setPage } from "@/store/navigation/state/state";
import {
  setInputStateEditNameReducer,
  setInputStateEditSerialNumberReducer,
  setInputStateEditCommentReducer,
  setEquipments,
} from "@/store/equipments/state/state";
import { patchEquipment } from "@/store/equipments/patch/patch";
import { trimIgnoringNL } from "@/helpers/strings";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const serialNumberInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const equipmentId = pageParamsWhenMounted?.id;
  const equipmentDraftId = pageParamsWhenMounted?.draftId;

  const equipmentsList = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const equipmentData = useMemo(() => {
    return equipmentsList.find((equipment) => {
      if (equipment?.id && equipmentId && equipment.id == equipmentId)
        return true;

      if (
        equipment?.draftId &&
        equipmentDraftId &&
        equipment?.draftId == equipmentDraftId
      )
        return true;

      return false;
    });
  }, [equipmentsList, equipmentId, equipmentDraftId]);

  useEffect(() => {
    if (equipmentData) return;

    //  Navigate back if no equipment found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminEquipmentPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [dispatch, equipmentData, pageParamsWhenMounted]);

  useEffect(() => {
    //  Set fields on mount
    dispatch(
      setInputStateEditNameReducer({
        action: "setText",
        text: equipmentData?.name,
      })
    );
    dispatch(
      setInputStateEditSerialNumberReducer({
        action: "setText",
        text: equipmentData?.serialNumber,
      })
    );
    dispatch(
      setInputStateEditCommentReducer({
        action: "setText",
        text: equipmentData?.comment,
      })
    );

    //  Clear fields on unmount
    return () => {
      dispatch(setInputStateEditNameReducer({ action: "reset" }));
      dispatch(setInputStateEditSerialNumberReducer({ action: "reset" }));
      dispatch(setInputStateEditCommentReducer({ action: "reset" }));
    };
  }, [equipmentData]);

  const name = useSelector(
    (state: RootState) =>
      state.stateEquipments.editEquipmentFields.inputs.name.text
  );

  const handleChangeNameText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditNameReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const serialNumber = useSelector(
    (state: RootState) =>
      state.stateEquipments.editEquipmentFields.inputs.serialNumber.text
  );

  const handleChangeSerialNumberText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateEditSerialNumberReducer({ action: "setText", text })
      );
    },
    [dispatch]
  );

  const comment = useSelector(
    (state: RootState) =>
      state.stateEquipments.editEquipmentFields.inputs.comment.text
  );

  const handleChangeCommentText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditCommentReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const handleSubmitNameEditing = useCallback(() => {
    if (!name) return;
    if (!serialNumberInputRef.current) return;

    serialNumberInputRef.current.focus();
  }, [serialNumberInputRef, name, serialNumber, comment]);

  const handleSubmitSerialNumberEditing = useCallback(() => {
    if (!serialNumber) return;
    if (!commentInputRef.current) return;

    commentInputRef.current.focus();
  }, [commentInputRef, name, serialNumber, comment]);

  const isButtonDisabled = useMemo(() => {
    if (!name.trim()) return true;
    if (!serialNumber.trim()) return true;

    return false;
  }, [name, serialNumber]);

  const handleEditEquipment = useCallback(async () => {
    if (isButtonDisabled) return;

    const modifiedEquipmentsList = [...equipmentsList].map((equipment) => {
      if (
        (!equipment?.id || !equipmentId || equipment.id != equipmentId) &&
        (!equipment?.draftId ||
          !equipmentDraftId ||
          equipment?.draftId != equipmentDraftId)
      )
        return equipment;

      const isModified = equipment?.isModified
        ? equipment.isModified
        : equipment?.id
        ? true
        : false;

      return {
        ...equipment,
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        comment: trimIgnoringNL({ text: comment }),
        isModified,
      };
    });

    //  Set new equipment to store
    dispatch(
      setEquipments({ action: "setData", data: modifiedEquipmentsList })
    );

    //  Clear all inputs and states
    dispatch(setInputStateEditNameReducer({ action: "reset" }));
    dispatch(setInputStateEditSerialNumberReducer({ action: "reset" }));
    dispatch(setInputStateEditCommentReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminEquipmentPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );

    if (!equipmentId) return;

    dispatch(patchEquipment({ id: equipmentId }));
  }, [
    dispatch,
    isButtonDisabled,
    name,
    serialNumber,
    comment,
    pageParamsWhenMounted,
    equipmentsList,
    equipmentId,
    equipmentDraftId,
  ]);

  const installerData = useMemo(() => {
    if (!equipmentData) return;

    return installersList.find((installer) => {
      if (!installer?.id) return false;

      if (installer.id == equipmentData.installerId) return true;

      return false;
    });
  }, [equipmentData]);

  if (!equipmentData) return null;

  return (
    <Wrapper>
      <Header
        linkText={`#${
          equipmentData.id ? equipmentData.id : `(${equipmentData.draftId})`
        } ${equipmentData.name}`}
        to={`AdminEquipmentPage`}
        toParams={{ id: pageParamsWhenMounted.id }}
      />
      <Title>Редактирование оборудования</Title>
      <Content isWithPaddings={true}>
        {!!equipmentData?.applicationId && !!installerData?.id ? (
          <>
            <TwoColumns
              leftColumn={
                <>
                  <PressableArea
                    to={"AdminInstallerPage"}
                    toParams={{
                      id: equipmentData.installerId,
                      backLink: {
                        text: `#${
                          equipmentData.id
                            ? equipmentData.id
                            : `(${equipmentData.draftId})`
                        } ${equipmentData.name}`,
                        to: "AdminEditEquipmentPage",
                        params: { id: pageParamsWhenMounted.id },
                      },
                    }}
                  >
                    <TextType>У монтажника</TextType>
                  </PressableArea>
                </>
              }
              rightColumn={
                <>
                  <PressableArea
                    to={"AdminInstallerPage"}
                    toParams={{
                      id: equipmentData.installerId,
                      backLink: {
                        text: `#${
                          equipmentData.id
                            ? equipmentData.id
                            : `(${equipmentData.draftId})`
                        } ${equipmentData.name}`,
                        to: "AdminEditEquipmentPage",
                        params: { id: pageParamsWhenMounted.id },
                      },
                    }}
                  >
                    <TextType
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      align="right"
                      isDashed={true}
                    >
                      #{installerData.id} {installerData.lastname}{" "}
                      {installerData.firstname.charAt(0)}.{" "}
                      {installerData.middlename.charAt(0)}.
                    </TextType>
                  </PressableArea>
                  <TextType align="right" isDashed={true}>
                    Заявка #{equipmentData.applicationId}
                  </TextType>
                </>
              }
            />
          </>
        ) : (
          <TextType>На складе</TextType>
        )}
        <Inputs>
          <Input
            label="Название"
            value={name}
            onChangeText={handleChangeNameText}
            onSubmitEditing={handleSubmitNameEditing}
          ></Input>
          <Input
            label="Серийный номер"
            value={serialNumber}
            onChangeText={handleChangeSerialNumberText}
            onSubmitEditing={handleSubmitSerialNumberEditing}
            inputRef={serialNumberInputRef}
          ></Input>
          <Input
            label="Примечание"
            value={comment}
            onChangeText={handleChangeCommentText}
            isMultiline={true}
            inputRef={commentInputRef}
          ></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleEditEquipment}
        >
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
