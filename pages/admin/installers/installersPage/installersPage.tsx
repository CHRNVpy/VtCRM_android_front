import { FlatList, StyleSheet } from "react-native";
import { useMemo } from "react";
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

export default function Page() {
  const installersList = useMemo(() => {
    return [
      {
        id: "1",
        name: "Иванов Иван Иванович",
        phone: "+7 912 345-67-89",
        isActive: true,
      },
      {
        id: "2",
        name: "Петрова Мария Николаевна",
        phone: "+7 923 456-78-90",
        isActive: false,
      },
      {
        id: "3",
        name: "Сидоров Алексей Петрович",
        phone: "+7 934 567-89-01",
        isActive: false,
      },
      {
        id: "4",
        name: "Кузнецова Светлана Васильевна",
        phone: "+7 945 678-90-12",
        isActive: true,
      },
      {
        id: "5",
        name: "Никитин Дмитрий Александрович",
        phone: "+7 956 789-01-23",
        isActive: false,
      },
      {
        id: "6",
        name: "Морозова Ольга Сергеевна",
        phone: "+7 967 890-12-34",
        isActive: true,
      },
      {
        id: "7",
        name: "Кириллов Андрей Валерьевич",
        phone: "+7 978 901-23-45",
        isActive: true,
      },
      {
        id: "8",
        name: "Григорьева Наталья Дмитриевна",
        phone: "+7 989 012-34-56",
        isActive: false,
      },
      {
        id: "9",
        name: "Лебедев Игорь Юрьевич",
        phone: "+7 990 123-45-67",
        isActive: true,
      },
      {
        id: "10",
        name: "Белоусов Сергей Петрович",
        phone: "+7 991 234-56-78",
        isActive: true,
      },
      {
        id: "11",
        name: "Смирнова Екатерина Олеговна",
        phone: "+7 992 345-67-89",
        isActive: false,
      },
    ];
  }, []);

  return (
    <Wrapper>
      <Header linkText={"На главную"} to={"AdminMainPage"} />
      <Title>Монтажники</Title>
      {!!installersList.length && (
        <Content>
          <FlatList
            data={installersList}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <ListItem isLastItem={index === installersList.length - 1}>
                  <PressableArea
                    to={"AdminInstallerPage"}
                    toParams={{
                      id: item.id,
                    }}
                  >
                    <MarginBottom size="medium">
                      <TwoColumns
                        ratio="85/15"
                        leftColumn={
                          <>
                            <TextType size="big" marginBottom="small">
                              {item.name}
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
                              #{item.id}
                            </TextType>
                            <Status isActive={item.isActive} />
                          </>
                        }
                      />
                    </MarginBottom>
                  </PressableArea>
                  <TwoColumns
                    gap={"medium"}
                    leftColumn={
                      <Buttons isItemButtons={true}>
                        <Button
                          icon={
                            <ChangePasswordIcon width={s(13)} height={s(12)} />
                          }
                          size={"small"}
                          to={"AdminEditInstallerPasswordPage"}
                          toParams={{
                            id: item.id,
                            backLink: {
                              text: "Монтажники",
                              to: "AdminInstallersPage",
                            },
                          }}
                        >
                          Сменить пароль
                        </Button>
                        <Button
                          icon={<EditIcon width={s(5)} height={s(16)} />}
                          size={"small"}
                          to={"AdminEditInstallerPage"}
                          toParams={{
                            id: item.id,
                            backLink: {
                              text: "Монтажники",
                              to: "AdminInstallersPage",
                            },
                          }}
                        >
                          Редактировать
                        </Button>
                      </Buttons>
                    }
                    rightColumn={
                      <Buttons isItemButtons={true}>
                        <Button
                          icon={
                            item.isActive ? (
                              <TurnOffIcon width={s(9)} height={s(17)} />
                            ) : (
                              <TurnOnIcon width={s(9)} height={s(17)} />
                            )
                          }
                          size={"small"}
                        >
                          {item.isActive ? "Выключить" : "Включить"}
                        </Button>
                        <Button
                          icon={<ShareIcon width={s(13)} height={s(14)} />}
                          size={"small"}
                        >
                          Поделиться
                        </Button>
                      </Buttons>
                    }
                  />
                </ListItem>
              );
            }}
          />
        </Content>
      )}
      <Buttons>
        <Button to={"AdminCreateInstallerPage"}>Добавить монтажника</Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
