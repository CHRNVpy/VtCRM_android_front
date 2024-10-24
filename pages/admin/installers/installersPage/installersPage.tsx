import { FlatList, Share } from "react-native";
import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import TextType from "@/components/wrappers/textType/textType";
import Status from "@/components/wrappers/status/status";
import Content from "@/components/wrappers/content/content";
import ListItem from "@/components/wrappers/listItem/listItem";
import Title from "@/components/wrappers/title/title";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import ChangePasswordIcon from "@/assets/changePasswordIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";
import { s } from "react-native-size-matters";
import { nameFromNameParts } from "@/helpers/strings";
import { DefaultInstallerStateType } from "@/store/installers/state/types";
import { setInstallers } from "@/store/installers/state/state";
import { useIsInstallersSyncInProcess } from "@/components/hooks/isInstallersSyncInProcess/isInstallersSyncInProcess";
import { getInstallersCollection } from "@/store/installers/getCollection/getCollection";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const isInstallersSyncInProcess = useIsInstallersSyncInProcess();

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

        const status = installer.status == "active" ? "inactive" : "active";

        return { ...installer, status, isModified: true };
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

  //  When page opened
  useEffect(() => {
    if (installersList?.length > 0) return;

    dispatch(getInstallersCollection());
  }, []);

  return (
    <Wrapper>
      <Header
        linkText={"На главную"}
        to={"AdminMainPage"}
        isSyncInProcess={isInstallersSyncInProcess}
      />
      <Title>Монтажники</Title>
      <Content>
        {!installersList?.length && (
          <Content isWithPaddings={true}>
            <TextType color="gray">Монтажников нет</TextType>
          </Content>
        )}
        {!!installersList?.length && (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={installersList}
            keyExtractor={(item, index) =>
              item?.id
                ? `remote-${item?.id.toString()}`
                : item?.draftId
                ? `draft-${item?.draftId.toString()}`
                : `noid-${index}`
            }
            renderItem={({ item, index }) => {
              return (
                <ListItem isLastItem={index === installersList.length - 1}>
                  <PressableArea
                    to={"AdminInstallerPage"}
                    toParams={{
                      id: item.id,
                      draftId: item.draftId,
                    }}
                  >
                    <MarginBottom size="medium">
                      <TwoColumns
                        leftColumn={
                          <>
                            <TextType size="big" marginBottom="small">
                              {nameFromNameParts(item)}
                            </TextType>
                            <TextType size="medium">{item.phone}</TextType>
                          </>
                        }
                        rightColumn={
                          <>
                            <TextType
                              size="big"
                              align="right"
                              marginBottom="small"
                            >
                              {item.id
                                ? `#${item.id}`
                                : item.draftId
                                ? `#(${item.draftId})`
                                : ""}
                            </TextType>
                            <Status isActive={item.status == "active"} />
                          </>
                        }
                      />
                    </MarginBottom>
                  </PressableArea>
                  <TwoColumns
                    ratio="50/50"
                    gap={"medium"}
                    leftColumn={
                      <Buttons isItemButtons={true}>
                        <Button
                          icon={<EditIcon width={s(5)} height={s(16)} />}
                          size={"small"}
                          to={"AdminEditInstallerPage"}
                          toParams={{
                            id: item.id,
                            draftId: item?.draftId,
                            backLink: {
                              text: "Монтажники",
                              to: "AdminInstallersPage",
                            },
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          icon={
                            <ChangePasswordIcon width={s(13)} height={s(12)} />
                          }
                          size={"small"}
                          to={"AdminEditInstallerPasswordPage"}
                          toParams={{
                            id: item?.id,
                            draftId: item?.draftId,
                            backLink: {
                              text: "Монтажники",
                              to: "AdminInstallersPage",
                            },
                          }}
                        >
                          Сменить пароль
                        </Button>
                      </Buttons>
                    }
                    rightColumn={
                      <Buttons isItemButtons={true}>
                        <Button
                          icon={
                            item.status == "active" ? (
                              <TurnOffIcon width={s(9)} height={s(17)} />
                            ) : (
                              <TurnOnIcon width={s(9)} height={s(17)} />
                            )
                          }
                          size={"small"}
                          onPress={async () => handleSwitchStatus(item)}
                        >
                          {item.status == "active" ? "Выключить" : "Включить"}
                        </Button>
                        {!!item?.login && (
                          <Button
                            icon={<ShareIcon width={s(13)} height={s(14)} />}
                            size={"small"}
                            onPress={async () => handleShareUserInfo(item)}
                          >
                            Поделиться
                          </Button>
                        )}
                      </Buttons>
                    }
                  />
                </ListItem>
              );
            }}
          />
        )}
      </Content>
      <Buttons>
        <Button to={"AdminCreateInstallerPage"}>Добавить монтажника</Button>
      </Buttons>
    </Wrapper>
  );
}
