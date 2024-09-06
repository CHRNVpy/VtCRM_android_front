import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "@/pages/login/login";
import AdminMainPage from "@/pages/admin/mainPage/mainPage";
import colors from "@/helpers/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="dark" backgroundColor={colors.white} />
          <Stack.Navigator initialRouteName={"Login"}>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminMainPage"
              component={AdminMainPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
