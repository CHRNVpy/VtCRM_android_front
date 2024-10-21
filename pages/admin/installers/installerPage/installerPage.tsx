import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Share } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import Status from "@/components/wrappers/status/status";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import CopyIconSvg from "@/assets/copyIcon.svg";
import { s } from "react-native-size-matters";
import { maskString } from "@/helpers/strings";
import ChangePasswordIcon from "@/assets/changePasswordIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";
import { setPage } from "@/store/navigation/state/state";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setInstallers } from "@/store/installers/state/state";
import { useIsInstallersSyncInProcess } from "@/components/hooks/isInstallersSyncInProcess/isInstallersSyncInProcess";
import * as Clipboard from "expo-clipboard";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isInstallersSyncInProcess = useIsInstallersSyncInProcess();

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const installerId = pageParamsWhenFocused?.id;
  const installerDraftId = pageParamsWhenFocused?.draftId;

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const installerData = useMemo(() => {
    return installersList.find((installer) => {
      if (!!installer?.id && !!installerId && installer.id == installerId)
        return true;

      if (
        !!installer?.draftId &&
        !!installerDraftId &&
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
          : "AdminInstallersPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {},
      })
    );
  }, [dispatch, installerData, pageParamsWhenFocused]);

  const handleShowPassword = useCallback(async () => {
    if (isPasswordVisible) {
      setIsPasswordVisible(false);

      return;
    }

    setIsPasswordVisible(true);
  }, [isPasswordVisible, setIsPasswordVisible]);

  const handleCopyUserData = useCallback(
    async (item: DefaultInstallerStateType) => {
      const text = `Монтажник ${item?.lastname} ${item?.firstname.charAt(
        0
      )}. ${item?.middlename.charAt(0)}.\nЛогин: ${item?.login}\nПароль: ${
        item.password
      }`;

      await Clipboard.setStringAsync(text);

      Alert.alert("Скопировано", text);
    },
    []
  );

  const handleSwitchStatus = useCallback(
    async (item: DefaultInstallerStateType) => {
      const installerId = item?.id;
      const installerDraftId = item?.draftId;

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

        const status = installer.status == "active" ? "inactive" : "active";

        return { ...installer, status, isModified };
      });

      //  Set new installer to store
      dispatch(
        setInstallers({ action: "setData", data: modifiedInstallersList })
      );
    },
    [installersList]
  );

  const handleShareUserInfo = useCallback(
    async (item: DefaultInstallerStateType) => {
      await Share.share({
        message: `Монтажник ${item?.lastname} ${item?.firstname.charAt(
          0
        )}. ${item?.middlename.charAt(0)}.\nЛогин: ${item?.login}\nПароль: ${
          item.password
        }`,
      });
    },
    []
  );

  if (!installerData) return;

  return (
    <Wrapper>
      <Header
        linkText={"Монтажники"}
        to={"AdminInstallersPage"}
        isSyncInProcess={isInstallersSyncInProcess}
      />
      <Content isWithPaddings={true}>
        <MarginBottom size="biggest">
          <TwoColumns
            leftColumn={
              <>
                <TextType size="biggest" isBold={true}>
                  {installerData.id
                    ? `#${installerData.id}`
                    : installerData.draftId
                    ? `#(${installerData.draftId})`
                    : ""}
                </TextType>
                <Title isNoPadding={true}>
                  {installerData.lastname} {installerData.firstname}{" "}
                  {installerData.middlename}
                </Title>
                <TextType size="big">{installerData.phone}</TextType>
              </>
            }
            rightColumn={
              <>
                <Status
                  size="big"
                  isActive={installerData.status == "active"}
                />
              </>
            }
          />
        </MarginBottom>
        {!!installerData.login && (
          <TwoColumns
            ratio="85/15"
            leftColumn={
              <>
                <MarginBottom>
                  <MarginBottom size="smallest">
                    <TextType size="big" isBold={true}>
                      {installerData.login}
                    </TextType>
                  </MarginBottom>
                  <TextType size="big" isBold={true}>
                    {isPasswordVisible
                      ? installerData.password
                      : maskString({ string: installerData.password })}
                  </TextType>
                </MarginBottom>
                <TextType
                  size="big"
                  color={"gray"}
                  isDashed={true}
                  onPress={handleShowPassword}
                >
                  {isPasswordVisible ? `Скрыть пароль` : `Показать пароль`}
                </TextType>
              </>
            }
            rightColumn={
              <Pressable
                onPress={async () => handleCopyUserData(installerData)}
              >
                <CopyIconSvg height={s(24)} width={s(21)} />
              </Pressable>
            }
          />
        )}
      </Content>
      <Buttons>
        {!!installerData?.login && (
          <Button
            icon={<ShareIcon width={s(18)} height={s(20)} />}
            onPress={async () => handleShareUserInfo(installerData)}
          >
            Поделиться данными доступа
          </Button>
        )}
        <Button
          icon={
            installerData.status == "active" ? (
              <TurnOffIcon width={s(13)} height={s(22)} />
            ) : (
              <TurnOnIcon width={s(13)} height={s(22)} />
            )
          }
          onPress={async () => handleSwitchStatus(installerData)}
        >
          {installerData.status == "active" ? "Выключить" : "Включить"}
        </Button>
        <Button
          icon={<ChangePasswordIcon width={s(22)} height={s(20)} />}
          to={"AdminEditInstallerPasswordPage"}
          toParams={{
            id: pageParamsWhenFocused?.id,
            draftId: pageParamsWhenFocused?.draftId,
          }}
        >
          Сменить пароль
        </Button>
        <Button
          icon={<EditIcon width={s(7)} height={s(22)} />}
          to={"AdminEditInstallerPage"}
          toParams={{
            id: pageParamsWhenFocused?.id,
            draftId: pageParamsWhenFocused?.draftId,
          }}
        >
          Редактировать
        </Button>
      </Buttons>
    </Wrapper>
  );
}
