import { StyleSheet, ViewProps, Pressable } from "react-native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootStackParamList } from "@/NavigationContext";
import { setPage } from "@/store/navigation/state/state";

interface ButtonProps extends ViewProps {
  onPress?: () => void;
  isDisabled?: boolean;
  to?: keyof RootStackParamList;
  toParams?: { [key: string]: any };
}

export default function Component({
  children,
  onPress,
  isDisabled = false,
  to,
  toParams,
}: ButtonProps) {
  const dispatch: AppDispatch = useDispatch();

  const handleOnPress = useCallback(() => {
    if (isDisabled) return;

    if (to)
      dispatch(setPage({ action: "setData", data: to, params: toParams }));

    if (onPress) onPress();
  }, [isDisabled, onPress, to, toParams]);

  return <Pressable onPress={handleOnPress}>{children}</Pressable>;
}

const styles = StyleSheet.create({});
