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
import { patchInstaller } from "@/store/installers/patch/patch";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const installerId = pageParamsWhenFocused?.id;
  const installerDraftId = pageParamsWhenFocused?.draftId;

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
        installer?.draftId == installerDraftId
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
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {
              id: pageParamsWhenFocused.id,
              draftId: pageParamsWhenFocused.draftId,
            },
      })
    );
  }, [dispatch, installerData, pageParamsWhenFocused]);

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
    if (!password.trim()) return true;

    return false;
  }, [password]);

  const handleEditInstaller = useCallback(async () => {
    if (isButtonDisabled) return;

    const modifiedInstallersList = [...installersList].map((installer) => {
      if (
        (!installer?.id || !installerId || installer.id != installerId) &&
        (!installer?.draftId ||
          !installerDraftId ||
          installer?.draftId != installerDraftId)
      )
        return installer;

      const isModified = installer?.isModified
        ? installer.isModified
        : installer?.id
        ? true
        : false;

      return { ...installer, password: password.trim(), isModified };
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
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminInstallerPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {
              id: pageParamsWhenFocused.id,
              draftId: pageParamsWhenFocused.draftId,
            },
      })
    );

    if (!installerId) return;

    dispatch(patchInstaller({ id: installerId }));
  }, [
    dispatch,
    isButtonDisabled,
    password,
    pageParamsWhenFocused,
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
        toParams={{ id: pageParamsWhenFocused?.id }}
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
