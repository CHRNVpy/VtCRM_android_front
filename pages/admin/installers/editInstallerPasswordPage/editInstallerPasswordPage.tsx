import { StyleSheet, Text } from "react-native";
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

export default function Page() {
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

  return (
    <Wrapper>
      <Header
        linkText={`#${installerData.id} ${installerData.lastName} ${installerData.firstName} ${installerData.patronym}`}
      />
      <Title>Изменение пароля</Title>
      <Content isWithPaddings={true}>
        <Inputs>
          <Input label="Новый пароль" value={""} type="newPassword"></Input>
        </Inputs>
      </Content>
      <Buttons>
        <Button icon={<SaveIcon width={s(20)} height={s(20)} />}>
          Изменить пароль
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
