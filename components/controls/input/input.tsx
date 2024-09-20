import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import { ReactNode, useCallback, useRef, useState } from "react";
import { s } from "react-native-size-matters";
import { generateRandomPassword } from "@/helpers/strings";
import colors from "@/helpers/colors";
import PasswordVisibleSvg from "@/assets/passwordVisible.svg";
import PasswordHiddenSvg from "@/assets/passwordHidden.svg";
import RandomPasswordSvg from "@/assets/randomPassword.svg";

interface InputProps extends TextInputProps {
  label: string;
  children?: ReactNode;
  onSubmitEditing?: (event: any) => void;
  onChangeText?: (value?: string) => void;
  type?: "password" | "newPassword";
  value?: string;
  inputRef?: React.RefObject<TextInput>;
  isDisabled?: boolean;
  isHasClearButton?: boolean;
  isError?: boolean;
}

export default function Input({
  label = "",
  type,
  value,
  inputRef,
  onSubmitEditing,
  onChangeText,
  isDisabled = false,
  isHasClearButton = false,
  isError = false,
}: InputProps) {
  const inputForwardOrLocalRef = inputRef ? inputRef : useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

  const handlePress = useCallback(() => {
    if (!isDisabled) return;

    if (!inputForwardOrLocalRef.current) return;

    inputForwardOrLocalRef.current.focus();
  }, [inputForwardOrLocalRef, isDisabled]);

  const handlePasswordIconPress = useCallback(() => {
    if (isDisabled) return;

    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible, isDisabled]);

  const handleRandomPasswordIconPress = useCallback(() => {
    if (isDisabled) return;

    if (!onChangeText) return;

    onChangeText(generateRandomPassword(12));
  }, [onChangeText, isDisabled]);

  const handleTextInputFocus = useCallback(() => {
    if (isDisabled) return;

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
  }, [value, isDisabled]);

  const handleTextInputBlur = useCallback(() => {
    if (isDisabled) return;

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
  }, [value, isDisabled]);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.touchable]}>
        <View
          style={[
            styles.inputWrapper,
            !!isDisabled && styles.isDisabled,
            !!isError && styles.isInputWrapperError,
          ]}
        >
          <TextInput
            style={[styles.textInput, !!isError && styles.isTextInputError]}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText}
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            secureTextEntry={type == "password" && !isPasswordVisible}
            value={value}
            ref={inputRef}
            editable={!isDisabled}
          />
          <View pointerEvents={"none"} style={[styles.labelWrapper]}>
            <Animated.Text
              style={[
                styles.label,
                !!isError && styles.isLabelError,
                labelAnimatedStyle,
              ]}
            >
              {label}
            </Animated.Text>
          </View>
          {type == "password" && (
            <TouchableOpacity
              style={styles.passwordIconWrapper}
              onPress={handlePasswordIconPress}
            >
              {isPasswordVisible ? (
                <PasswordHiddenSvg
                  width={s(24)}
                  height={s(24)}
                  style={!isError ? styles.svg : styles.isSvgError}
                />
              ) : (
                <PasswordVisibleSvg
                  width={s(24)}
                  height={s(24)}
                  style={!isError ? styles.svg : styles.isSvgError}
                />
              )}
            </TouchableOpacity>
          )}
          {type == "newPassword" && (
            <TouchableOpacity
              style={styles.passwordIconWrapper}
              onPress={handleRandomPasswordIconPress}
            >
              <RandomPasswordSvg
                width={s(20)}
                height={s(20)}
                style={!isError ? styles.svg : styles.isSvgError}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchable: {
    height: s(60),
    paddingTop: s(8),
    paddingBottom: s(8),
  },
  inputWrapper: {
    width: "100%",
    height: s(44),
    borderBottomWidth: s(2),
    borderBottomColor: colors.dark,
    borderBottomStyle: "solid",
    paddingTop: s(16),
  },
  isInputWrapperError: {
    borderBottomColor: colors.red,
  },
  isDisabled: {
    opacity: 0.6,
  },
  textInput: {
    width: "100%",
    color: colors.dark,
    fontSize: s(18),
    fontFamily: "Inter_400Regular",
    lineHeight: s(24),
    height: s(24),
  },
  isTextInputError: {
    color: colors.red,
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
  isLabelError: {
    color: colors.red,
  },
  labelFinalPosition: {
    height: s(16),
    lineHeight: s(16),
    fontSize: s(12),
    top: s(0),
  },
  passwordIconWrapper: {
    position: "absolute",
    right: s(0),
    width: s(24),
    height: s(24),
    top: s(18),
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    color: colors.dark,
  },
  isSvgError: {
    color: colors.red,
  },
});
