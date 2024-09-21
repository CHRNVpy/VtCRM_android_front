import React, { useRef } from "react";
import { NavigationProvider, RootStackParamList } from "@/NavigationContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import AppContent from "@/AppContent";
import { setInitialNavigationState } from "@/store/navigation/state/state";

const Component = () => {
  const dispatch: AppDispatch = useDispatch();

  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const initialNavigationState = useSelector(
    (state: RootState) => state.stateNavigation.initialNavigationState.data
  );

  return (
    <NavigationContainer
      initialState={
        initialNavigationState ? JSON.parse(initialNavigationState) : undefined
      }
      onStateChange={async (state) => {
        dispatch(
          setInitialNavigationState({
            action: "setData",
            data: JSON.stringify(state),
          })
        );
      }}
      ref={navigationRef}
    >
      <NavigationProvider navigationRef={navigationRef}>
        <AppContent />
      </NavigationProvider>
    </NavigationContainer>
  );
};

export default Component;
