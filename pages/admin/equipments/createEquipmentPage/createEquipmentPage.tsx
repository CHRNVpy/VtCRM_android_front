import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
import colors from "@/helpers/colors";
import Header from "@/components/container/header/header";
import Inputs from "@/components/wrappers/inputs/inputs";
import Input from "@/components/controls/input/input";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Content from "@/components/wrappers/content/content";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Title from "@/components/wrappers/title/title";
import { s } from "react-native-size-matters";
import SaveIcon from "@/assets/saveIcon.svg";

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
      <Header linkText={`Оборудование`} to={"AdminEquipmentsPage"} />
      <Title>Добавление оборудования</Title>
      <Content isWithPaddings={true}>
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
          Добавить
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
