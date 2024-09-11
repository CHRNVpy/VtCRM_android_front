import { View, StyleSheet } from "react-native";
import { ReactNode, Children, isValidElement } from "react";
import Input from "@/components/controls/input/input";
import { s } from "react-native-size-matters";

interface InputsProps {
  children?: ReactNode;
  verticalAlign?: "center";
}

export default function Inputs({ children, verticalAlign }: InputsProps) {
  return (
    <View
      style={[
        styles.inputs,
        verticalAlign == "center" && styles.verticalAlignCenter,
      ]}
    >
      {Children.map(children, (child, index) => {
        const isLastItem = index === Children.count(children) - 1;

        if (isValidElement(child) && child.type === Input) {
          return (
            <View
              key={index}
              style={[styles.input, !!isLastItem && styles.isLastItem]}
            >
              {child}
            </View>
          );
        }
        return child;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  inputs: {
    justifyContent: "flex-start",
    paddingLeft: s(15),
    paddingRight: s(15),
  },
  verticalAlignCenter: {
    justifyContent: "center",
  },
  input: {
    width: "100%",
  },
  isLastItem: {
    marginBottom: s(0),
  },
});
