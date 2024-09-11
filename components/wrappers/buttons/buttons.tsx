import { View, StyleSheet } from "react-native";
import { ReactNode, Children, isValidElement } from "react";
import Button from "@/components/controls/button/button";
import { s } from "react-native-size-matters";

interface ButtonsProps {
  children?: ReactNode;
  isItemButtons?: boolean;
}

export default function Buttons({
  children,
  isItemButtons = false,
}: ButtonsProps) {
  return (
    <View style={[styles.buttons, !!isItemButtons && styles.isItemButtons]}>
      {Children.map(children, (child, index) => {
        const isLastItem = index === Children.count(children) - 1;

        if (isValidElement(child) && child.type === Button) {
          return (
            <View
              key={index}
              style={[
                styles.button,
                !!isItemButtons && styles.isItemButton,
                !!isLastItem && styles.isLastItem,
              ]}
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
  buttons: {
    paddingTop: s(10),
    paddingBottom: s(10),
    paddingLeft: s(15),
    paddingRight: s(15),
    width: "100%",
  },
  isItemButtons: {
    paddingLeft: s(0),
    paddingRight: s(0),
    paddingTop: s(0),
    paddingBottom: s(0),
  },
  button: {
    marginBottom: s(10),
  },
  isItemButton: {
    marginBottom: s(4),
  },
  isLastItem: {
    marginBottom: s(0),
  },
});
