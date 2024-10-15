import {
  Text,
  TextInputProps,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { useCallback, useMemo, useState } from "react";
import { s } from "react-native-size-matters";
import colors from "@/helpers/colors";
import { formatDateString } from "@/helpers/strings";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

interface InputProps extends TextInputProps {
  label: string;
  onChangeDate?: (value?: string) => void;
  value?: string;
  isDisabled?: boolean;
  isHasClearButton?: boolean;
  isError?: boolean;
}

export default function Input({
  label = "",
  onChangeDate,
  value,
  isDisabled = false,
  isHasClearButton = false,
  isError = false,
}: InputProps) {
  const dateValue = useMemo(() => {
    if (!value) return new Date();

    return new Date(value);
  }, [value]);

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    if (!onChangeDate) return;

    DateTimePickerAndroid.open({
      value: dateValue,
      onChange: (event, selectedDate) => {
        if (!selectedDate) return;

        DateTimePickerAndroid.open({
          value: selectedDate,
          onChange: (event, selectedDateTime) => {
            if (!selectedDateTime) return;

            const selectedMoscowTime = new Date(
              selectedDateTime.getTime() -
                (selectedDateTime.getTimezoneOffset() + 3 * 60) * 60 * 1000
            );

            onChangeDate(selectedMoscowTime.toISOString());
          },
          mode: "time",
          is24Hour: true,
          display: "default",
        });
      },
      mode: "date",
      is24Hour: true,
      display: "default",
    });
  }, [dateValue, isDisabled, onChangeDate]);

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
          <Text
            style={[styles.textInput, !!isError && styles.isTextInputError]}
          >
            {value
              ? formatDateString({ dateString: value })
              : "Время не выбрано..."}
          </Text>
          <View pointerEvents={"none"} style={[styles.labelWrapper]}>
            <Text style={[styles.label, !!isError && styles.isLabelError]}>
              {label}
            </Text>
          </View>
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
