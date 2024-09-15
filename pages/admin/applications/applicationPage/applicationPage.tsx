import { ScrollView, Image, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import Header from "@/components/container/header/header";
import Buttons from "@/components/wrappers/buttons/buttons";
import Button from "@/components/controls/button/button";
import Title from "@/components/wrappers/title/title";
import Wrapper from "@/components/wrappers/wrapper/wrapper";
import Content from "@/components/wrappers/content/content";
import MarginBottom from "@/components/wrappers/marginBottom/marginBottom";
import TwoColumns from "@/components/wrappers/twoColumns/twoColumns";
import EditIcon from "@/assets/editIcon.svg";
import TurnOnIcon from "@/assets/turnOnIcon.svg";
import TurnOffIcon from "@/assets/turnOffIcon.svg";
import { s } from "react-native-size-matters";
import { formatDateString } from "@/helpers/strings";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import TextType from "@/components/wrappers/textType/textType";
import colors from "@/helpers/colors";

export default function Page() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  const applicationItem = useMemo(() => {
    return {
      id: 1,
      client: {
        name: "Арефьев Т.С.",
      },
      type: "connection",
      datetime: "2024-08-16T16:30:00Z",
      note: "Подключение нового абонента",
      equipments: [
        {
          id: "1",
          name: "Fluke Networks DTX-1800",
          serialNumber: "DTX2-342462",
          note: "Не предназначено для работы с бетоном или каменными материалами",
        },
        {
          id: "2",
          name: "Megger MIT485",
          serialNumber: "MIT4-584390",
          note: "Требуется калибровка каждые 6 месяцев",
        },
      ],
      isActive: true,
      pool: {
        id: 1,
      },
      installer: {
        id: "1",
        lastName: "Иванов",
        firstName: "Иван",
        patronym: "Иванович",
        phone: "+7 912 345-67-89",
        login: "iivanov",
        password: "adslfIYNGHlfIYNGH-454",
        isActive: true,
      },
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Wrapper>
      <Header linkText={`Пул #${applicationItem.pool.id}`} />
      <ScrollView>
        <MarginBottom>
          <TwoColumns
            ratio="85/15"
            leftColumn={
              <Title isNoMargin={true}>{applicationItem.client.name}</Title>
            }
            rightColumn={
              <TextType size="biggest">#{applicationItem.id}</TextType>
            }
          />
        </MarginBottom>
        <Content isWithPaddings={true}>
          <MarginBottom size="big">
            <TextType isDashed={true}>
              Монтажник #{applicationItem.installer.id}{" "}
              {applicationItem.installer.lastName}{" "}
              {applicationItem.installer.firstName.charAt(0)}.
              {applicationItem.installer.patronym.charAt(0)}.
            </TextType>
          </MarginBottom>
          <MarginBottom size="big">
            <TextType size="small">{applicationItem.note}</TextType>
          </MarginBottom>
          {applicationItem.equipments.length > 0 && (
            <MarginBottom>
              {applicationItem.equipments.map((equipment, equipmentIndex) => {
                const isLastItem =
                  equipmentIndex === applicationItem.equipments.length - 1;

                const equipmentItem = (
                  <>
                    <TextType isBold={true}>
                      #{equipment.id} {equipment.name}
                    </TextType>
                    <TextType>{equipment.serialNumber}</TextType>
                  </>
                );

                return (
                  <React.Fragment key={equipmentIndex}>
                    {isLastItem ? (
                      equipmentItem
                    ) : (
                      <MarginBottom>{equipmentItem}</MarginBottom>
                    )}
                  </React.Fragment>
                );
              })}
            </MarginBottom>
          )}
          <MarginBottom>
            <TextType isBold={true}>
              {applicationItem.type == "connection"
                ? "Подключение"
                : applicationItem.type == "repair"
                ? "Ремонт"
                : "Монтаж ВОЛС"}
            </TextType>
            <TextType>
              {formatDateString({
                dateString: applicationItem.datetime,
              })}
            </TextType>
          </MarginBottom>
          <MarginBottom>
            <TextType isBold={true}>
              {applicationItem.isActive ? "В работе" : "Отменена"}
            </TextType>
          </MarginBottom>
          <TwoColumns
            gap="medium"
            leftColumn={
              <>
                <Content>
                  <MarginBottom size="smallest">
                    <Image
                      source={{
                        uri: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
                      }}
                      style={styles.images}
                      resizeMode={"contain"}
                    />
                  </MarginBottom>
                  <Image
                    source={{
                      uri: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
                    }}
                    style={styles.images}
                    resizeMode={"contain"}
                  />
                </Content>
              </>
            }
            rightColumn={
              <>
                <Content>
                  <MarginBottom size="smallest">
                    <Image
                      source={{
                        uri: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
                      }}
                      style={styles.images}
                      resizeMode={"contain"}
                    />
                  </MarginBottom>
                  <Image
                    source={{
                      uri: "https://avatars.mds.yandex.net/i?id=10152ebea69f69ddc2f4ea52edccbb34_l-10471913-images-thumbs&n=13",
                    }}
                    style={styles.images}
                    resizeMode={"contain"}
                  />
                </Content>
              </>
            }
          />
        </Content>
      </ScrollView>
      <Buttons>
        <Button icon={<EditIcon width={s(7)} height={s(22)} />}>
          Редактировать
        </Button>
        <Button
          icon={
            applicationItem.isActive ? (
              <TurnOffIcon width={s(13)} height={s(22)} />
            ) : (
              <TurnOnIcon width={s(13)} height={s(22)} />
            )
          }
        >
          {applicationItem.isActive ? "Отменить" : "Возобновить"}
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  images: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.gray,
  },
});
