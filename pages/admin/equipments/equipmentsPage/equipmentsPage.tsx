import { FlatList, StyleSheet, ViewToken } from "react-native";
import { useCallback, useRef, useState, useEffect } from "react";
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
import Loading from "@/components/controls/loading/loading";
import EditIcon from "@/assets/editIcon.svg";
import AddIcon from "@/assets/addIcon.svg";
import { s } from "react-native-size-matters";
import { trimIgnoringNL } from "@/helpers/strings";
import { debounce } from "lodash";
import { getEquipmentsCollection } from "@/store/equipments/getCollection/getCollection";
import { useIsEquipmentsSyncInProcess } from "@/components/hooks/isEquipmentsSyncInProcess/isEquipmentsSyncInProcess";

export default function Page() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pageByScrollData, setPageByScrollData] = useState<{
    firstIndex: number | null;
    page?: number;
  }>();
  const dispatch: AppDispatch = useDispatch();

  const isEquipmentsSyncInProcess = useIsEquipmentsSyncInProcess();

  const equipmentsList = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const totalPages = useSelector(
    (state: RootState) => state.stateEquipments.totalPages.data
  );

  const pagesLoaded = useSelector(
    (state: RootState) => state.stateEquipments.pagesLoaded.data
  );

  const handleOnEndReached = useCallback(() => {
    if (totalPages <= pagesLoaded) return;

    //  Get current state of equipments collection
    dispatch(getEquipmentsCollection({ page: pagesLoaded + 1 }));
  }, [totalPages, pagesLoaded]);

  const debouncedGetEquipmentsByPage = useCallback(
    debounce((updatePage) => {
      //  Get current state of equipments collection
      dispatch(getEquipmentsCollection({ page: updatePage }));
    }, 300),
    [dispatch]
  );

  //  When page opened
  useEffect(() => {
    if (equipmentsList?.length > 0) return;

    dispatch(getEquipmentsCollection({ page: 1 }));
  }, []);

  const handleOnViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;
      if (!viewableItems?.[0]) return;

      setPageByScrollData((prevPageByScrollData) => {
        if (!viewableItems[0]?.item?.page) return prevPageByScrollData;

        //  Just to filter nulls
        if (prevPageByScrollData?.firstIndex === null)
          return prevPageByScrollData;
        if (viewableItems[0].index === null) return prevPageByScrollData;

        //  If not set, set first
        if (!prevPageByScrollData)
          return {
            firstIndex: viewableItems[0].index,
            page: viewableItems[0]?.item?.page,
          };

        //  If same first index
        if (prevPageByScrollData?.firstIndex == viewableItems[0].index)
          return prevPageByScrollData;

        if (prevPageByScrollData?.firstIndex > viewableItems[0].index) {
          return {
            firstIndex: viewableItems[0].index,
            page: viewableItems[0]?.item?.page,
          };
        }

        return {
          firstIndex: viewableItems[0].index,
          page: viewableItems[viewableItems?.length - 1]?.item?.page,
        };
      });
    }
  ).current;

  useEffect(() => {
    if (pageByScrollData?.page === undefined) return;

    debouncedGetEquipmentsByPage(pageByScrollData?.page);

    return () => {
      debouncedGetEquipmentsByPage.cancel();
    };
  }, [pageByScrollData?.page, debouncedGetEquipmentsByPage]);

  return (
    <Wrapper>
      <Header
        linkText={"На главную"}
        to={"AdminMainPage"}
        isSyncInProcess={isEquipmentsSyncInProcess}
      />
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
            onEndReached={handleOnEndReached}
            onEndReachedThreshold={0.5}
            onViewableItemsChanged={handleOnViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 0 }}
            keyboardShouldPersistTaps="always"
            data={equipmentsList}
            ListFooterComponent={
              <Loading isInProcess={totalPages > pagesLoaded} />
            }
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
                        draftId: item.draftId,
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
