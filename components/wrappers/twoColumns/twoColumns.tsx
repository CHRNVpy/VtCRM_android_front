import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { s } from "react-native-size-matters";

interface TwoColumnsProps {
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  ratio?: "85/15";
  gap?: "medium";
}

export default function TwoColumns({
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
          gap == "medium" && styles.leftColumnGap,
        ]}
      >
        {leftColumn}
      </View>
      <View
        style={[
          styles.rightColumn,
          ratio == "85/15" && styles.rightColumn15,
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
  leftColumn: {
    width: "50%",
  },
  leftColumn85: {
    width: "85%",
  },
  leftColumnGap: {
    marginRight: s(2),
  },
  rightColumn: {
    width: "50%",
    alignItems: "flex-end",
  },
  rightColumn15: {
    width: "15%",
  },
  rightColumnGap: {
    marginLeft: s(2),
  },
});
