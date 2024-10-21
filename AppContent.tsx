import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigationContext } from "@/NavigationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginPage from "@/pages/loginPage/loginPage";
import AdminMainPage from "@/pages/admin/mainPage/mainPage";
import AdminInstallersPage from "@/pages/admin/installers/installersPage/installersPage";
import AdminInstallerPage from "@/pages/admin/installers/installerPage/installerPage";
import AdminEditInstallerPage from "@/pages/admin/installers/editInstallerPage/editInstallerPage";
import AdminEditInstallerPasswordPage from "@/pages/admin/installers/editInstallerPasswordPage/editInstallerPasswordPage";
import AdminCreateInstallerPage from "@/pages/admin/installers/createInstallerPage/createInstallerPage";
import AdminEquipmentsPage from "@/pages/admin/equipments/equipmentsPage/equipmentsPage";
import AdminEquipmentPage from "@/pages/admin/equipments/equipmentPage/equipmentPage";
import AdminEditEquipmentPage from "@/pages/admin/equipments/editEquipmentPage/editEquipmentPage";
import AdminCreateEquipmentPage from "@/pages/admin/equipments/createEquipmentPage/createEquipmentPage";
import AdminApplicationsPoolsPage from "@/pages/admin/applications/poolsPage/poolsPage";
import AdminApplicationsPoolPage from "@/pages/admin/applications/poolPage/poolPage";
import AdminApplicationPage from "@/pages/admin/applications/applicationPage/applicationPage";
import AdminEditApplicationPage from "@/pages/admin/applications/editApplicationPage/editApplicationPage";
import AdminCreateApplicationPage from "@/pages/admin/applications/createApplicationPage/createApplicationPage";
import AdminEditEquipmentsListInApplicationPage from "@/pages/admin/applications/editEquipmentsListInApplicationPage/editEquipmentsListInApplicationPage";
import { setPage } from "@/store/navigation/state/state";
import { setPostLoginStateReducer } from "@/store/login/post/post";
import colors from "@/helpers/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  const dispatch: AppDispatch = useDispatch();

  const { navigate } = useNavigationContext();

  const accessToken = useSelector(
    (state: RootState) => state.stateNavigation.accessToken.data
  );

  const page = useSelector(
    (state: RootState) => state.stateNavigation.page.data
  );

  const pageParams = useSelector(
    (state: RootState) => state.stateNavigation.page.params
  );

  //  Clear the login state to avoid persisting a pending state after the app is restarted, which can happen if the state is persisted
  useEffect(() => {
    dispatch(setPostLoginStateReducer({ action: "reset" }));
  }, []);

  //  Navigate if accessToken or page changed
  useEffect(() => {
    if (!accessToken) {
      navigate("LoginPage");

      return;
    }

    if (page) {
      navigate(page, pageParams);

      return;
    }

    //  Default admin page
    dispatch(setPage({ action: "setData", data: "AdminMainPage" }));
    navigate("AdminMainPage");
  }, [accessToken, page, pageParams]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.white} />
        <Stack.Navigator
          screenOptions={{
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
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
          <Stack.Screen
            name="AdminEquipmentPage"
            component={AdminEquipmentPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminEditEquipmentPage"
            component={AdminEditEquipmentPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminCreateEquipmentPage"
            component={AdminCreateEquipmentPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminApplicationsPoolsPage"
            component={AdminApplicationsPoolsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminApplicationsPoolPage"
            component={AdminApplicationsPoolPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminApplicationPage"
            component={AdminApplicationPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminEditApplicationPage"
            component={AdminEditApplicationPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminCreateApplicationPage"
            component={AdminCreateApplicationPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminEditEquipmentsListInApplicationPage"
            component={AdminEditEquipmentsListInApplicationPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </View>
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
