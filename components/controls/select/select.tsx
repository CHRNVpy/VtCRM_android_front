import {
  Dimensions,
  Text,
  TextInputProps,
  StyleSheet,
  View,
} from "react-native";
import { useCallback } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";
import RNPickerSelect from "react-native-picker-select";
import DropDownIconSvg from "@/assets/dropDownIcon.svg";

interface InputProps extends TextInputProps {
  label: string;
  onValueChange?: (value?: string) => void;
  items: {
    label: string;
    value: string;
    key?: string;
    color?: string;
    inputLabel?: string;
    testID?: string;
  }[];
  itemKey?: string;
  isDisabled?: boolean;
  isError?: boolean;
}

export default function Input({
  label = "",
  items,
  itemKey,
  onValueChange,
  isDisabled = false,
  isError = false,
}: InputProps) {
  const handleChangeValue = useCallback(
    (text?: string) => {
      if (!onValueChange) return;

      onValueChange(text);
    },
    [onValueChange]
  );

  return (
    <View
      style={[
        styles.inputWrapper,
        !!isDisabled && styles.isDisabled,
        !!isError && styles.isInputWrapperError,
      ]}
    >
      <RNPickerSelect
        onValueChange={handleChangeValue}
        items={items}
        itemKey={itemKey}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        style={{
          inputAndroid: [
            styles.textInput,
            !!isError && styles.isTextInputError,
          ],
          inputAndroidContainer: styles.textInputAndroidContainer,
          placeholder: styles.textInputPlaceholder,
          iconContainer: {
            alignContent: "center",
            justifyContent: "center",
            width: s(16),
            height: s(24),
          },
        }}
        Icon={() => <DropDownIconSvg width={s(13)} height={s(10)} />}
      />
      <View pointerEvents={"none"} style={[styles.labelWrapper]}>
        <Text style={[styles.label, !!isError && styles.isLabelError]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    height: s(44),
    borderBottomWidth: s(2),
    borderBottomColor: colors.dark,
    borderBottomStyle: "solid",
    paddingTop: s(16),
    alignItems: "flex-start",
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
    paddingLeft: s(0),
    paddingRight: s(20),
  },
  textInputAndroidContainer: {
    width: Dimensions.get("window").width - s(15 + 15),
  },
  textInputPlaceholder: {
    width: "100%",
    color: colors.gray,
    textAlignVertical: "top",
    fontSize: s(18),
    fontFamily: "Inter_400Regular",
    lineHeight: s(24),
    height: s(24),
    paddingLeft: s(0),
  },
  isTextInputError: {
    color: colors.red,
  },
  labelWrapper: {
    position: "absolute",
  },
  label: {
    height: s(16),
    lineHeight: s(16),
    fontSize: s(12),
    top: s(0),
    fontFamily: "Inter_400Regular",
    color: colors.dark,
  },
  isLabelError: {
    color: colors.red,
  },
});
