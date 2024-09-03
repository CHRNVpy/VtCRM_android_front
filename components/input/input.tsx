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

interface InputProps extends TextInputProps {
  label: string;
  children: ReactNode;
  onChangeText?: () => void;
}

export default function Input({ label = "", onChangeText }: InputProps) {
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
    labelHeight.value = withTiming(12, { duration: 500 });
    labelLineHeight.value = withTiming(12, { duration: 500 });
    labelFontSize.value = withTiming(10, { duration: 500 });
    labelTop.value = withTiming(0, { duration: 500 });
  };

  const handleTextInputBlur = () => {
    labelHeight.value = withTiming(labelInitialHeight, { duration: 500 });
    labelLineHeight.value = withTiming(labelInitialLineHeight, {
      duration: 500,
    });
    labelFontSize.value = withTiming(labelInitialFontSize, { duration: 500 });
    labelTop.value = withTiming(labelInitialTop, { duration: 500 });
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
    height: 34,
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
    borderBottomStyle: "solid",
    paddingTop: 12,
  },
  textInput: {
    width: "100%",
    color: "#333333",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    height: 18,
  },
  labelWrapper: {
    position: "absolute",
  },
  label: {
    height: 22,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    color: "#333333",
    top: 12,
  },
});
