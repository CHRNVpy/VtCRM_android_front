import { TextInput } from "react-native";
import { useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Title from "@/components/wrappers/title/title";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import SaveIcon from "@/assets/saveIcon.svg";
import {
  setInputStateCreateNameReducer,
  setInputStateCreateSerialNumberReducer,
  setInputStateCreateCommentReducer,
  setEquipments,
} from "@/store/equipments/state/state";
import { DefaultEquipmentStateType } from "@/store/equipments/state/types";
import { setPage } from "@/store/navigation/state/state";
import { s } from "react-native-size-matters";
import { trimIgnoringNL } from "@/helpers/strings";
import { postEquipment } from "@/store/equipments/post/post";

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

  const name = useSelector(
    (state: RootState) =>
      state.stateEquipments.createEquipmentFields.inputs.name.text
  );

  const serialNumber = useSelector(
    (state: RootState) =>
      state.stateEquipments.createEquipmentFields.inputs.serialNumber.text
  );

  const comment = useSelector(
    (state: RootState) =>
      state.stateEquipments.createEquipmentFields.inputs.comment.text
  );

  const equipmentsData = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const handleChangeNameText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateNameReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeSerialNumberText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateSerialNumberReducer({
          action: "setText",
          text,
        })
      );
    },
    [dispatch]
  );

  const handleChangeCommentText = useCallback(
    (text?: string) => {
      dispatch(
        setInputStateCreateCommentReducer({
          action: "setText",
          text,
        })
      );
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

  const handleCreateEquipment = useCallback(async () => {
    if (isButtonDisabled) return;

    //  Make new draftId -> biggest id plus one
    const draftId = equipmentsData.reduce((id, equipment) => {
      if (!equipment?.draftId && !equipment?.id) return id;

      const equipmentId = equipment?.id
        ? equipment.id
        : equipment?.draftId
        ? equipment.draftId
        : 0;

      if (id >= equipmentId + 1) return id;

      return equipmentId + 1;
    }, 1);

    //  Random hash which sets in local equipment and then posts to remote equipment
    const hash = (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
    ).toUpperCase();

    const newEquipment: DefaultEquipmentStateType = {
      draftId,
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      comment: trimIgnoringNL({ text: comment }),
      hash,
    };

    const data = [...equipmentsData, newEquipment];

    //  Set new equipment to store
    dispatch(setEquipments({ action: "setData", data }));

    //  Clear all inputs and states
    dispatch(setInputStateCreateNameReducer({ action: "reset" }));
    dispatch(setInputStateCreateSerialNumberReducer({ action: "reset" }));
    dispatch(setInputStateCreateCommentReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminEquipmentsPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {},
      })
    );

    dispatch(postEquipment({ id: draftId }));
  }, [
    dispatch,
    isButtonDisabled,
    name,
    serialNumber,
    comment,
    equipmentsData,
    pageParamsWhenMounted,
  ]);

  return (
    <Wrapper>
      <Header linkText={`Оборудование`} to={"AdminEquipmentsPage"} />
      <Title>Добавление оборудования</Title>
      <Content isWithScrollView={true}>
        <Inputs isWithPaddings={true}>
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
          onPress={handleCreateEquipment}
        >
          Добавить
        </Button>
      </Buttons>
    </Wrapper>
  );
}
