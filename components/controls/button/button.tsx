import {
  Text,
  StyleSheet,
  View,
  ViewProps,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ReactNode, useCallback } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";

interface ButtonProps extends ViewProps {
  children?: ReactNode;
  isInProcess?: boolean;
  isDisabled?: boolean;
  size?: "small";
  icon?: ReactNode;
  onPress?: () => void;
}

export default function Component({
  children,
  isInProcess = false,
  isDisabled = false,
  size,
  style,
  icon,
  onPress,
}: ButtonProps) {
  const handleOnPress = useCallback(() => {
    if (isDisabled) return;

    if (!onPress) return;

    onPress();
  }, [isDisabled, onPress]);

  return (
    <Pressable onPress={handleOnPress}>
      <View
        style={[
          styles.button,
          !!isDisabled && styles.isDisabled,
          size == "small" && styles.buttonSmall,
          style,
        ]}
      >
        {isInProcess ? (
          <ActivityIndicator
            size={size == "small" ? 12 : 26}
            color={colors.dark}
          />
        ) : (
          <>
            {!!icon && (
              <View style={[styles.icon, size == "small" && styles.smallIcon]}>
                {icon}
              </View>
            )}
            <Text style={[styles.text, size == "small" && styles.smallText]}>
              {children}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: s(48),
    width: "100%",
    backgroundColor: colors.button,
    borderRadius: 4,
    flexDirection: "row",
  },
  buttonSmall: {
    height: s(26),
  },
  isDisabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: s(18),
    lineHeight: s(22),
    color: colors.dark,
  },
  smallText: {
    fontSize: s(14),
  },
  icon: {
    marginRight: s(8),
    width: s(18),
    alignItems: "center",
    justifyContent: "center",
  },
  smallIcon: {
    marginRight: s(5),
    width: s(13),
  },
});
