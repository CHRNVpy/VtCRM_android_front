import { StyleSheet, Text } from "react-native";
import { useMemo } from "react";
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
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

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

  if (!fontsLoaded) return null;

  return (
    <Wrapper>
      <Header linkText={`#${equipmentData.id} ${equipmentData.name}`} />
      <Title>Редактирование оборудования</Title>
      <Content isWithPaddings={true}>
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
                    align="right"
                    isDashed={true}
                  >
                    #{equipmentData.application.installer.id}{" "}
                    {equipmentData.application.installer.lastName}{" "}
                    {equipmentData.application.installer.firstName.charAt(0)}.{" "}
                    {equipmentData.application.installer.patronym.charAt(0)}.
                  </TextType>
                  <TextType align="right" isDashed={true}>
                    Заявка #{equipmentData.application.id}
                  </TextType>
                </>
              }
            />
          </>
        ) : (
          <TextType>На складе</TextType>
        )}
        <Inputs>
          <Input label="Название" value={equipmentData.name}></Input>
          <Input
            label="Серийный номер"
            value={equipmentData.serialNumber}
          ></Input>
          <Input label="Примечание" value={equipmentData.note}></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button icon={<SaveIcon width={s(20)} height={s(20)} />}>
          Сохранить
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
