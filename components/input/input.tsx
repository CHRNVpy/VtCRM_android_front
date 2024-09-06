import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import { ReactNode, useCallback, useRef } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";

interface InputProps extends TextInputProps {
  label: string;
  children?: ReactNode;
  onSubmitEditing?: (event: any) => void;
  onChangeText?: (value?: string) => void;
  type?: "password";
  value?: string;
  inputRef?: React.RefObject<TextInput>;
}

export default function Input({
  label = "",
  type,
  value,
  inputRef,
  onSubmitEditing,
  onChangeText,
}: InputProps) {
  const inputForwardOrLocalRef = inputRef ? inputRef : useRef<TextInput>(null);

  const animationDuration = 100;
  const labelInitialHeight = styles.label.height;
  const labelInitialLineHeight = styles.label.lineHeight;
  const labelInitialFontSize = styles.label.fontSize;
  const labelInitialTop = styles.label.top;

  const labelFinalHeight = styles.labelFinalPosition.height;
  const labelFinalLineHeight = styles.labelFinalPosition.lineHeight;
  const labelFinalFontSize = styles.labelFinalPosition.fontSize;
  const labelFinalTop = styles.labelFinalPosition.top;

  const labelHeight = useSharedValue(labelInitialHeight);
  const labelLineHeight = useSharedValue(labelInitialLineHeight);
  const labelFontSize = useSharedValue(labelInitialFontSize);
  const labelTop = useSharedValue(labelInitialTop);

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: value ? labelFinalHeight : labelHeight.value,
      lineHeight: value ? labelFinalLineHeight : labelLineHeight.value,
      fontSize: value ? labelFinalFontSize : labelFontSize.value,
      top: value ? labelFinalTop : labelTop.value,
    };
  });

  const handlePress = () => {
    if (!inputForwardOrLocalRef.current) return;

    inputForwardOrLocalRef.current.focus();
  };

  const handleTextInputFocus = useCallback(() => {
    if (!!value) return;

    labelHeight.value = withTiming(labelFinalHeight, {
      duration: animationDuration,
    });
    labelLineHeight.value = withTiming(labelFinalLineHeight, {
      duration: animationDuration,
    });
    labelFontSize.value = withTiming(labelFinalFontSize, {
      duration: animationDuration,
    });
    labelTop.value = withTiming(labelFinalTop, {
      duration: animationDuration,
    });
  }, [value]);

  const handleTextInputBlur = useCallback(() => {
    if (!!value) return;

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
  }, [value]);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.touchable]}>
        <View style={[styles.inputWrapper]}>
          <TextInput
            style={[styles.textInput]}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText}
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            secureTextEntry={type == "password"}
            value={value}
            ref={inputRef}
          />
          <View pointerEvents={"none"} style={[styles.labelWrapper]}>
            <Animated.Text style={[styles.label, labelAnimatedStyle]}>
              {label}
            </Animated.Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchable: {
    height: s(64),
    paddingTop: s(10),
    paddingBottom: s(10),
  },
  inputWrapper: {
    width: "100%",
    height: s(44),
    borderBottomWidth: s(2),
    borderBottomColor: colors.dark,
    borderBottomStyle: "solid",
    paddingTop: s(16),
  },
  textInput: {
    width: "100%",
    color: colors.dark,
    fontSize: s(18),
    fontFamily: "Inter_400Regular",
    lineHeight: s(24),
    height: s(24),
  },
  labelWrapper: {
    position: "absolute",
  },
  label: {
    height: s(24),
    lineHeight: s(24),
    fontSize: s(18),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
    top: s(16),
  },
  labelFinalPosition: {
    height: s(16),
    lineHeight: s(16),
    fontSize: s(12),
    top: s(0),
  },
});
