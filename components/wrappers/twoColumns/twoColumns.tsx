import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface TwoColumnsProps {
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  ratio?: "85/15" | "50/50" | "15/85" | "30/70";
  gap?: "medium";
}

export default function Component({
  leftColumn,
  rightColumn,
  ratio,
  gap,
}: TwoColumnsProps) {
  return (
    <View style={styles.content}>
      <View
        style={[
          styles.leftColumn,
          ratio == "85/15" && styles.leftColumn85,
          ratio == "50/50" && styles.leftColumn50,
          ratio == "15/85" && styles.leftColumn15,
          ratio == "30/70" && styles.leftColumn30,
          gap == "medium" && styles.leftColumnGap,
        ]}
      >
        {leftColumn}
      </View>
      <View
        style={[
          styles.rightColumn,
          ratio == "85/15" && styles.rightColumn15,
          ratio == "50/50" && styles.rightColumn50,
          ratio == "15/85" && styles.rightColumn85,
          ratio == "30/70" && styles.rightColumn70,
          gap == "medium" && styles.rightColumnGap,
        ]}
      >
        {rightColumn}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {},
  leftColumn15: {
    width: "15%",
  },
  leftColumn30: {
    width: "30%",
  },
  leftColumn50: {
    width: "50%",
  },
  leftColumn85: {
    width: "85%",
  },
  leftColumnGap: {
    marginRight: s(2),
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  rightColumn15: {
    width: "15%",
  },
  rightColumn50: {
    width: "50%",
  },
  rightColumn70: {
    width: "70%",
  },
  rightColumn85: {
    width: "85%",
  },
  rightColumnGap: {
    marginLeft: s(2),
  },
});
