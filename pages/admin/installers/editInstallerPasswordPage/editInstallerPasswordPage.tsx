import { StyleSheet } from "react-native";
import { useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import Content from "@/components/wrappers/content/content";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Title from "@/components/wrappers/title/title";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";
import { setPage } from "@/store/navigation/state/state";
import {
  setInputStateEditPasswordReducer,
  setInstallers,
} from "@/store/installers/state/state";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  // Wrapping in useMemo without dependencies to prevent header from changing when the page updates
  const pageParamsWhenMounted = useMemo(() => {
    return pageParams;
  }, []);

  const installerId = pageParamsWhenMounted?.id;
  const installerDraftId = pageParamsWhenMounted?.draftId;

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const installerData = useMemo(() => {
    return installersList.find((installer) => {
      if (installer?.id && installerId && installer.id == installerId)
        return true;

      if (
        installer?.draftId &&
        installerDraftId &&
        installerDraftId == installerDraftId
      )
        return true;

      return false;
    });
  }, [installersList, installerId, installerDraftId]);

  useEffect(() => {
    if (installerData) return;

    //  Navigate back if no installer found
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [dispatch, installerData]);

  useEffect(() => {
    //  Clear password field on unmount

    return () => {
      dispatch(setInputStateEditPasswordReducer({ action: "reset" }));
    };
  }, []);

  const password = useSelector(
    (state: RootState) =>
      state.stateInstallers.editInstallerFields.inputs.password.text
  );

  const handleChangePasswordText = useCallback(
    (text?: string) => {
      dispatch(setInputStateEditPasswordReducer({ action: "setText", text }));
    },
    [dispatch]
  );

  const isButtonDisabled = useMemo(() => {
    if (!password) return true;

    return false;
  }, [, password]);

  const handleEditInstaller = useCallback(() => {
    if (isButtonDisabled) return;

    const modifiedInstallersList = [...installersList].map((installer) => {
      if (
        (!installer?.id || !installerId || installer.id != installerId) &&
        (!installer?.draftId ||
          !installerDraftId ||
          installerDraftId != installerDraftId)
      )
        return installer;

      console.log(installer);

      const isModified = installer?.isModified
        ? installer.isModified
        : installer?.id
        ? true
        : false;

      console.log({ ...installer, password, isModified });

      return { ...installer, password, isModified };
    });

    //  Set new installer to store
    dispatch(
      setInstallers({ action: "setData", data: modifiedInstallersList })
    );

    //  Clear all inputs and states
    dispatch(setInputStateEditPasswordReducer({ action: "reset" }));

    //  Change page to parent
    dispatch(
      setPage({
        action: "setData",
        data: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenMounted?.backLink?.to
          ? pageParamsWhenMounted?.backLink?.params
          : {
              id: pageParamsWhenMounted.id,
              draftId: pageParamsWhenMounted.draftId,
            },
      })
    );
  }, [
    dispatch,
    isButtonDisabled,
    password,
    pageParamsWhenMounted,
    installersList,
    installerId,
    installerDraftId,
  ]);

  if (!installerData) return null;

  return (
    <Wrapper>
      <Header
        linkText={`#${installerData.id} ${installerData.lastname} ${installerData.firstname} ${installerData.middlename}`}
        to={"AdminInstallerPage"}
        toParams={{ id: pageParamsWhenMounted?.id }}
      />
      <Title>Изменение пароля</Title>
      <Content isWithPaddings={true}>
        <Inputs>
          <Input
            label="Новый пароль"
            value={password}
            type="newPassword"
            onChangeText={handleChangePasswordText}
          ></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button
          icon={<SaveIcon width={s(20)} height={s(20)} />}
          isDisabled={isButtonDisabled}
          onPress={handleEditInstaller}
        >
          Изменить пароль
        </Button>
      </Buttons>
    </Wrapper>
  );
}
