import React, { createContext, useContext, RefObject } from "react";
import { NavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = Record<
  string,
  undefined | { [param: string]: any }
>;

type NavigationContextType = {
  navigate: (name: keyof RootStackParamList) => void;
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>>;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider"
    );
  }
  return context;
};

export const NavigationProvider: React.FC<{
  children: React.ReactNode;
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList>>;
}> = ({ children, navigationRef }) => {
  const navigate = (name: keyof RootStackParamList) => {
    navigationRef.current?.navigate(name);
  };

  return (
    <NavigationContext.Provider value={{ navigate, navigationRef }}>
      {children}
    </NavigationContext.Provider>
  );
};
