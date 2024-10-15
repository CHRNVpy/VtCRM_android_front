import {
  Text,
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
import { ReactNode, useCallback, useRef, useState } from "react";
import { s } from "react-native-size-matters";
import { generateRandomPassword } from "@/helpers/strings";
import colors from "@/helpers/colors";
import PasswordVisibleSvg from "@/assets/passwordVisible.svg";
import PasswordHiddenSvg from "@/assets/passwordHidden.svg";
import RandomPasswordSvg from "@/assets/randomPassword.svg";
import { normalizePhone } from "@/helpers/strings";

interface InputProps extends TextInputProps {
  label: string;
  children?: ReactNode;
  onSubmitEditing?: (event: any) => void;
  onBlur?: (event: any) => void;
  onChangeText?: (value?: string) => void;
  type?: "password" | "newPassword";
  value?: string;
  inputRef?: React.RefObject<TextInput>;
  isDisabled?: boolean;
  isHasClearButton?: boolean;
  isError?: boolean;
  isPhoneMask?: boolean;
  isMultiline?: boolean;
}

export default function Input({
  label = "",
  type,
  value,
  inputRef,
  onSubmitEditing,
  onBlur,
  onChangeText,
  isDisabled = false,
  isHasClearButton = false,
  isError = false,
  isPhoneMask = false,
  isMultiline = false,
}: InputProps) {
  const inputForwardOrLocalRef = inputRef ? inputRef : useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [linesCount, setLinesCount] = useState(8);
  const [oneLineHeight, setOneLineHeight] = useState(s(24));
  const [selection, setSelection] = useState<
    | {
        start: number;
        end: number;
      }
    | undefined
  >(undefined);
  const [isFocused, setInFocuses] = useState(false);

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
      height: value || isFocused ? labelFinalHeight : labelHeight.value,
      lineHeight:
        value || isFocused ? labelFinalLineHeight : labelLineHeight.value,
      fontSize: value || isFocused ? labelFinalFontSize : labelFontSize.value,
      top: value || isFocused ? labelFinalTop : labelTop.value,
    };
  });

  const handleChangeText = useCallback(
    (text?: string) => {
      if (!onChangeText) return;

      onChangeText(text);
    },
    [onChangeText]
  );

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    if (!inputForwardOrLocalRef.current) return;

    inputForwardOrLocalRef.current.focus();

    if (!value) return;

    setTimeout(() => {
      if (!inputForwardOrLocalRef.current) return;

      setSelection({
        start: value.length,
        end: value.length,
      });

      setTimeout(() => {
        setSelection(undefined);
      }, 0);
    }, 0);
  }, [inputForwardOrLocalRef, value, isDisabled, setSelection]);

  const handlePasswordIconPress = useCallback(() => {
    if (isDisabled) return;

    setIsPasswordVisible(!isPasswordVisible);
  }, [isPasswordVisible, isDisabled]);

  const handleRandomPasswordIconPress = useCallback(() => {
    if (isDisabled) return;

    handleChangeText(generateRandomPassword(12));
  }, [onChangeText, isDisabled]);

  const handleTextInputFocus = useCallback(() => {
    if (isDisabled) return;

    setInFocuses(true);

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
  }, [value, isDisabled, setInFocuses]);

  const handleTextInputBlur = useCallback(
    (event: any) => {
      if (isDisabled) return;

      setInFocuses(false);

      if (!!isPhoneMask) handleChangeText(normalizePhone({ phone: value }));

      if (onBlur) onBlur(event);

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
    },
    [value, isDisabled, onBlur, onChangeText, isPhoneMask, setInFocuses]
  );

  const handleSubmitEditing = useCallback(
    (event: any) => {
      if (!!isPhoneMask) handleChangeText(normalizePhone({ phone: value }));

      if (!onSubmitEditing) return;

      setTimeout(() => {
        onSubmitEditing(event);
      }, 200);
    },
    [onSubmitEditing, isPhoneMask, value]
  );

  const handleContentSizeChange = useCallback(
    (contentHeight: number) => {
      const numberOfLines = Math.round(contentHeight / oneLineHeight);

      const newOneLineHeight = contentHeight / numberOfLines;

      setOneLineHeight(newOneLineHeight);

      setLinesCount(numberOfLines > 8 ? numberOfLines : 8);
    },
    [setLinesCount, setOneLineHeight, oneLineHeight]
  );

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[styles.touchable, isMultiline && styles.touchableIsMultiline]}
      >
        <View
          style={[
            styles.inputWrapper,
            !!isDisabled && styles.isDisabled,
            !!isError && styles.isInputWrapperError,
            isMultiline && styles.inputWrapperIsMultiline,
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              !!isError && styles.isTextInputError,
              { height: isMultiline ? linesCount * s(24) : s(24) },
            ]}
            onSubmitEditing={handleSubmitEditing}
            onChangeText={handleChangeText}
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            secureTextEntry={type == "password" && !isPasswordVisible}
            value={value}
            ref={inputForwardOrLocalRef}
            editable={!isDisabled}
            selection={selection}
            multiline={isMultiline}
            numberOfLines={isMultiline ? linesCount : 1}
            onContentSizeChange={(e) =>
              handleContentSizeChange(e.nativeEvent.contentSize.height)
            }
            scrollEnabled={false}
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
  touchableIsMultiline: {
    height: "auto",
  },
  inputWrapper: {
    width: "100%",
    height: s(44),
    borderBottomWidth: s(2),
    borderBottomColor: colors.dark,
    borderBottomStyle: "solid",
    paddingTop: s(16),
    alignItems: "flex-start",
  },
  inputWrapperIsMultiline: {
    height: "auto",
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
    textAlignVertical: "top",
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
