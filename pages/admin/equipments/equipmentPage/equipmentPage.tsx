import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import PressableArea from "@/components/controls/pressableArea/pressableArea";
import { setPage } from "@/store/navigation/state/state";
import { s } from "react-native-size-matters";
import EditIcon from "@/assets/editIcon.svg";
import { trimIgnoringNL } from "@/helpers/strings";
import { useIsEquipmentsSyncInProcess } from "@/components/hooks/isEquipmentsSyncInProcess/isEquipmentsSyncInProcess";
import usePageParamsWhenFocused from "@/components/hooks/pageParamsWhenFocused/pageParamsWhenFocused";

export default function Page() {
  const dispatch: AppDispatch = useDispatch();

  const isEquipmentsSyncInProcess = useIsEquipmentsSyncInProcess();

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  const pageParamsWhenFocused = usePageParamsWhenFocused();

  const equipmentId = pageParamsWhenFocused?.id;
  const equipmentDraftId = pageParamsWhenFocused?.draftId;

  const equipmentsList = useSelector(
    (state: RootState) => state.stateEquipments.equipments.data
  );

  const installersList = useSelector(
    (state: RootState) => state.stateInstallers.installers.data
  );

  const equipmentData = useMemo(() => {
    return equipmentsList.find((equipment) => {
      if (!!equipment?.id && !!equipmentId && equipment.id == equipmentId)
        return true;

      if (
        !!equipment?.draftId &&
        !!equipmentDraftId &&
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
        data: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.to
          : "AdminEquipmentsPage",
        params: pageParamsWhenFocused?.backLink?.to
          ? pageParamsWhenFocused?.backLink?.params
          : {},
      })
    );
  }, [dispatch, equipmentData, pageParamsWhenFocused]);

  const installerData = useMemo(() => {
    if (!equipmentData) return;

    return installersList.find((installer) => {
      if (!installer?.id) return false;

      if (installer.id == equipmentData.installerId) return true;

      return false;
    });
  }, [equipmentData]);

  if (!equipmentData) return;

  return (
    <Wrapper>
      <Header
        linkText={"Оборудование"}
        to={"AdminEquipmentsPage"}
        isSyncInProcess={isEquipmentsSyncInProcess}
      />
      <Content isWithPaddings={true}>
        <MarginBottom>
          <TextType size="biggest" isBold={true}>
            {equipmentData.id
              ? `#${equipmentData.id}`
              : equipmentData.draftId
              ? `#(${equipmentData.draftId})`
              : ""}
          </TextType>
          <Title isNoPadding={true}>{equipmentData.name}</Title>
          <TextType>{equipmentData.serialNumber}</TextType>
        </MarginBottom>
        {!!trimIgnoringNL({ text: equipmentData.comment }) && (
          <MarginBottom>
            <TextType size="small">
              {trimIgnoringNL({ text: equipmentData.comment })}
            </TextType>
          </MarginBottom>
        )}
        {!!equipmentData?.applicationId && !!installerData?.id ? (
          <>
            <TwoColumns
              leftColumn={
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
                      to: "AdminEquipmentPage",
                      params: { id: equipmentData.id },
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
                      id: equipmentData.installerId,
                      backLink: {
                        text: `#${
                          equipmentData.id
                            ? equipmentData.id
                            : `(${equipmentData.draftId})`
                        } ${equipmentData.name}`,
                        to: "AdminEquipmentPage",
                        params: { id: equipmentData.id },
                      },
                    }}
                  >
                    <TextType
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      isDashed={true}
                      align="right"
                    >
                      #{equipmentData.installerId} {installerData.lastname}{" "}
                      {installerData.firstname.charAt(0)}.{" "}
                      {installerData.middlename.charAt(0)}.
                    </TextType>
                  </PressableArea>
                  <TextType isDashed={true} align="right">
                    Заявка #{equipmentData.applicationId}
                  </TextType>
                </>
              }
            />
          </>
        ) : (
          <TextType>На складе</TextType>
        )}
      </Content>
      <Buttons>
        <Button
          icon={<EditIcon width={s(7)} height={s(22)} />}
          to={"AdminEditEquipmentPage"}
          toParams={{
            id: equipmentId,
            draftId: equipmentDraftId,
          }}
        >
          Редактировать
        </Button>
      </Buttons>
    </Wrapper>
  );
}
