import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Login from "@/pages/login/login";
import AdminMainPage from "@/pages/admin/mainPage/mainPage";
import AdminInstallersPage from "@/pages/admin/installers/installersPage/installersPage";
import AdminInstallerPage from "@/pages/admin/installers/installerPage/installerPage";
import AdminEditInstallerPage from "@/pages/admin/installers/editInstallerPage/editInstallerPage";
import AdminEditInstallerPasswordPage from "@/pages/admin/installers/editInstallerPasswordPage/editInstallerPasswordPage";
import AdminCreateInstallerPage from "@/pages/admin/installers/createInstallerPage/createInstallerPage";
import AdminEquipmentsPage from "@/pages/admin/equipments/equipmentsPage/equipmentsPage";
import colors from "@/helpers/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="dark" backgroundColor={colors.white} />
          <Stack.Navigator initialRouteName={"AdminEquipmentsPage"}>
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
            <Stack.Screen
              name="AdminInstallersPage"
              component={AdminInstallersPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminInstallerPage"
              component={AdminInstallerPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminEditInstallerPage"
              component={AdminEditInstallerPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminEditInstallerPasswordPage"
              component={AdminEditInstallerPasswordPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminCreateInstallerPage"
              component={AdminCreateInstallerPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminEquipmentsPage"
              component={AdminEquipmentsPage}
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
