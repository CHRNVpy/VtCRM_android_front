import { StyleSheet, View, Text } from "react-native";
import { useMemo } from "react";
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
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const installerData = useMemo(() => {
    return {
      id: "1",
      name: "Иванов Иван Иванович",
      lastName: "Иванов",
      firstName: "Иван",
      patronym: "Иванович",
      phone: "+7 912 345-67-89",
      login: "iivanov",
      password: "adslfIYNGHlfIYNGH-454",
      isActive: true,
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Wrapper>
      <Header
        linkText={`#${installerData.id} ${installerData.lastName} ${installerData.firstName} ${installerData.patronym}`}
      />
      <Title>Редактирование монтажника</Title>
      <Content isWithPaddings={true}>
        <Inputs>
          <Input label="Фамилия" value={installerData.lastName}></Input>
          <Input label="Имя" value={installerData.firstName}></Input>
          <Input label="Отчество" value={installerData.patronym}></Input>
          <Input
            label="Логин"
            value={installerData.login}
            isDisabled={true}
          ></Input>
          <Input label="Телефон" value={installerData.phone}></Input>
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
