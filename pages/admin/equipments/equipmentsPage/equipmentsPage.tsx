import { FlatList, StyleSheet, Text } from "react-native";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Title from "@/components/wrappers/title/title";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Content from "@/components/wrappers/content/content";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import ListItem from "@/components/wrappers/listItem/listItem";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import TextType from "@/components/wrappers/textType/textType";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import EditIcon from "@/assets/editIcon.svg";
import AddIcon from "@/assets/addIcon.svg";
import { s } from "react-native-size-matters";
import { trimIgnoringNL } from "@/helpers/strings";

export default function Page() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const equipmentsList = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  return (
    <Wrapper>
      <Header linkText={"На главную"} to={"AdminMainPage"} />
      <Title
        isWithSettings={true}
        isNoMargin={isSettingsOpen}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={async () => setIsSettingsOpen(!isSettingsOpen)}
      >
        Оборудование
      </Title>
      {!!isSettingsOpen && (
        <MarginBottom>
          <Inputs isWithPaddings={true}>
            <Input label="Поиск по всем полям" isHasClearButton={true}></Input>
            <Input label="Статус" isHasClearButton={true}></Input>
            <Input label="Монтажник" isHasClearButton={true}></Input>
          </Inputs>
        </MarginBottom>
      )}
      {!!equipmentsList.length && (
        <Content>
          <FlatList
            keyboardShouldPersistTaps="always"
            data={equipmentsList}
            keyExtractor={(item, index) =>
              item?.id
                ? `remote-${item?.id.toString()}`
                : item?.draftId
                ? `draft-${item?.draftId.toString()}`
                : `noid-${index}`
            }
            renderItem={({ item, index }) => {
              const installerData = installersList.find((installer) => {
                if (!installer?.id) return false;

                if (installer.id == item.installerId) return true;

                return false;
              });

              return (
                <ListItem isLastItem={index === equipmentsList.length - 1}>
                  <PressableArea
                    to={"AdminEquipmentPage"}
                    toParams={{
                      id: item.id,
                      draftId: item.draftId,
                    }}
                  >
                    <MarginBottom>
                      <TwoColumns
                        ratio="85/15"
                        leftColumn={
                          <>
                            <MarginBottom size="small">
                              <TextType>{item.name}</TextType>
                            </MarginBottom>
                            <TextType>{item.serialNumber}</TextType>
                          </>
                        }
                        rightColumn={
                          <TextType align="right">
                            {item.id
                              ? `#${item.id}`
                              : item.draftId
                              ? `#(${item.draftId})`
                              : ""}
                          </TextType>
                        }
                      />
                    </MarginBottom>
                    {!!trimIgnoringNL({ text: item.comment }) && (
                      <MarginBottom>
                        <TextType size="small">
                          {trimIgnoringNL({ text: item.comment })}
                        </TextType>
                      </MarginBottom>
                    )}
                  </PressableArea>
                  <MarginBottom>
                    {!!installerData?.id ? (
                      <>
                        <MarginBottom size="small">
                          <TwoColumns
                            leftColumn={
                              <PressableArea
                                to={"AdminInstallerPage"}
                                toParams={{
                                  id: installerData.id,
                                  backLink: {
                                    text: "Оборудование",
                                    to: "AdminEquipmentsPage",
                                  },
                                }}
                              >
                                <TextType>У монтажника</TextType>
                              </PressableArea>
                            }
                            rightColumn={
                              <>
                                <PressableArea
                                  to={"AdminInstallerPage"}
                                  toParams={{
                                    id: installerData.id,
                                    backLink: {
                                      text: "Оборудование",
                                      to: "AdminEquipmentsPage",
                                    },
                                  }}
                                >
                                  <TextType isDashed={true} align="right">
                                    #{installerData.id} {installerData.lastname}{" "}
                                    {installerData.firstname.charAt(0)}.{" "}
                                    {installerData.middlename.charAt(0)}.
                                  </TextType>
                                </PressableArea>
                              </>
                            }
                          />
                        </MarginBottom>
                        <TextType align="right" isDashed={true}>
                          Заявка #{item?.applicationId}
                        </TextType>
                      </>
                    ) : (
                      <TextType>На складе</TextType>
                    )}
                  </MarginBottom>
                  <Buttons isItemButtons={true}>
                    <Button
                      icon={<EditIcon width={s(5)} height={s(16)} />}
                      size={"small"}
                      to={"AdminEditEquipmentPage"}
                      toParams={{
                        id: item.id,
                        backLink: {
                          text: "Оборудование",
                          to: "AdminEquipmentsPage",
                        },
                      }}
                    >
                      Редактировать
                    </Button>
                  </Buttons>
                </ListItem>
              );
            }}
          />
        </Content>
      )}
      <Buttons>
        <Button
          icon={<AddIcon width={s(16)} height={s(16)} />}
          to={"AdminCreateEquipmentPage"}
        >
          Добавить оборудование
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
