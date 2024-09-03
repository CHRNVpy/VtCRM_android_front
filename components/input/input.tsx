import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface InputProps extends TextInputProps {
  label: string;
  children: ReactNode;
  onChangeText?: () => void;
}

export default function Input({ label = "", onChangeText }: InputProps) {
  const animationDuration = 100;
  const labelInitialHeight = styles.label.height;
  const labelInitialLineHeight = styles.label.lineHeight;
  const labelInitialFontSize = styles.label.fontSize;
  const labelInitialTop = styles.label.top;

  const labelHeight = useSharedValue(labelInitialHeight);
  const labelLineHeight = useSharedValue(labelInitialLineHeight);
  const labelFontSize = useSharedValue(labelInitialFontSize);
  const labelTop = useSharedValue(labelInitialTop);

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: labelHeight.value,
      lineHeight: labelLineHeight.value,
      fontSize: labelFontSize.value,
      top: labelTop.value,
    };
  });

  const handleTextInputFocus = () => {
    labelHeight.value = withTiming(s(16), { duration: animationDuration });
    labelLineHeight.value = withTiming(s(16), { duration: animationDuration });
    labelFontSize.value = withTiming(s(12), { duration: animationDuration });
    labelTop.value = withTiming(s(0), { duration: animationDuration });
  };

  const handleTextInputBlur = () => {
    labelHeight.value = withTiming(labelInitialHeight, {
      duration: animationDuration,
    });
    labelLineHeight.value = withTiming(labelInitialLineHeight, {
      duration: animationDuration,
    });
    labelFontSize.value = withTiming(labelInitialFontSize, {
      duration: animationDuration,
    });
    labelTop.value = withTiming(labelInitialTop, {
      duration: animationDuration,
    });
  };

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.inputWrapper]}>
      <TextInput
        style={[styles.textInput]}
        onChangeText={onChangeText}
        onFocus={handleTextInputFocus}
        onBlur={handleTextInputBlur}
      />
      <View pointerEvents={"none"} style={[styles.labelWrapper]}>
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    height: s(44),
    borderBottomWidth: s(2),
    borderBottomColor: "#333333",
    borderBottomStyle: "solid",
    paddingTop: s(16),
  },
  textInput: {
    width: "100%",
    color: "#333333",
    fontSize: s(18),
    fontFamily: "Inter_400Regular",
    lineHeight: s(24),
    height: s(24),
  },
  labelWrapper: {
    position: "absolute",
  },
  label: {
    height: s(28),
    fontSize: s(18),
    lineHeight: s(24),
    fontFamily: "Inter_400Regular",
    color: "#333333",
    top: s(16),
  },
});
