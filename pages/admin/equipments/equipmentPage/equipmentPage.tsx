import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import Title from "@/components/wrappers/title/title";
import TextType from "@/components/wrappers/textType/textType";
import Status from "@/components/wrappers/status/status";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import { s } from "react-native-size-matters";
import EditIcon from "@/assets/editIcon.svg";
import ShareIcon from "@/assets/shareIcon.svg";

export default function Page() {
  const equipmentData = useMemo(() => {
    return {
      id: "1",
      name: "Fluke Networks DTX-1800",
      serialNumber: "DTX2-342462",
      note: "Не предназначено для работы с бетоном или каменными материалами",
      isActive: true,
      application: {
        id: "1",
        installer: {
          id: "1",
          lastName: "Иванов",
          firstName: "Иван",
          patronym: "Иванович",
        },
        status: "done",
      },
    };
  }, []);

  return (
    <Wrapper>
      <Header linkText={"Оборудование"} />
      <Content isWithPaddings={true}>
        <MarginBottom>
          <TwoColumns
            ratio="85/15"
            leftColumn={
              <>
                <Title isNoPadding={true}>{equipmentData.name}</Title>
                <TextType>{equipmentData.serialNumber}</TextType>
              </>
            }
            rightColumn={
              <>
                <TextType size="biggest" align="right">
                  #{equipmentData.id}
                </TextType>
                <Status size="big" isActive={equipmentData.isActive} />
              </>
            }
          />
        </MarginBottom>
        <MarginBottom>
          <TextType size="small">{equipmentData.note}</TextType>
        </MarginBottom>
        {!!equipmentData?.application?.id ? (
          <>
            <TwoColumns
              leftColumn={
                <>
                  <TextType>У монтажника</TextType>
                </>
              }
              rightColumn={
                <>
                  <TextType
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    isDashed={true}
                    align="right"
                  >
                    #{equipmentData.application.installer.id}{" "}
                    {equipmentData.application.installer.lastName}{" "}
                    {equipmentData.application.installer.firstName.charAt(0)}.{" "}
                    {equipmentData.application.installer.patronym.charAt(0)}.
                  </TextType>
                  <TextType isDashed={true} align="right">
                    Заявка #{equipmentData.application.id}
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
        <Button icon={<ShareIcon width={s(18)} height={s(20)} />}>
          Поделиться
        </Button>
        <Button icon={<EditIcon width={s(7)} height={s(22)} />}>
          Редактировать
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
