import { StyleSheet } from "react-native";
import { useMemo } from "react";
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

export default function Page() {
  const installerData = useMemo(() => {
    return {
      id: "1",
      name: "Иванов Иван Иванович",
      phone: "+7 912 345-67-89",
      login: "iivanov",
      password: "adslfIYNGHlfIYNGH-454",
      isActive: true,
    };
  }, []);

  return (
    <Wrapper>
      <Header linkText={"Монтажники"} />
      <Content isWithPaddings={true}>
        <MarginBottom size="biggest">
          <TwoColumns
            ratio="85/15"
            leftColumn={
              <>
                <Title isNoPadding={true}>{installerData.name}</Title>
                <TextType size="big">{installerData.phone}</TextType>
              </>
            }
            rightColumn={
              <>
                <TextType size="biggest" align="right">
                  #{installerData.id}
                </TextType>
                <Status size="big" isActive={installerData.isActive} />
              </>
            }
          />
        </MarginBottom>
        <TwoColumns
          ratio="85/15"
          leftColumn={
            <>
              <MarginBottom>
                <MarginBottom>
                  <TextType size="big" isBold={true}>
                    {installerData.login}
                  </TextType>
                </MarginBottom>
                <TextType size="big" isBold={true}>
                  {maskString({ string: installerData.password })}
                </TextType>
              </MarginBottom>
              <TextType size="big" color={"gray"} isDashed={true}>
                Показать пароль
              </TextType>
            </>
          }
          rightColumn={<CopyIconSvg height={s(24)} width={s(21)} />}
        />
      </Content>
      <Buttons>
        <Button icon={<ShareIcon width={s(18)} height={s(20)} />}>
          Поделиться данными доступа
        </Button>
        <Button
          icon={
            installerData.isActive ? (
              <TurnOffIcon width={s(13)} height={s(22)} />
            ) : (
              <TurnOnIcon width={s(13)} height={s(22)} />
            )
          }
        >
          {installerData.isActive ? "Выключить" : "Включить"}
        </Button>
        <Button icon={<ChangePasswordIcon width={s(22)} height={s(20)} />}>
          Сменить пароль
        </Button>
        <Button icon={<EditIcon width={s(7)} height={s(22)} />}>
          Редактировать
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  copy: {
    height: s(28),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: s(4),
  },
});
