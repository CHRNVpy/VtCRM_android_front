import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/container/header/header";
import Button from "@/components/button/button";
import Login from "@/pages/login/login";
import { s } from "react-native-size-matters";

export default function App() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Header />
        <View style={styles.content}>
          <Login />
        </View>
        <View style={styles.button}>
          <Button>
            <Text>Войти</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  button: {
    paddingLeft: s(15),
    paddingRight: s(15),
    paddingBottom: s(15),
  },
});
