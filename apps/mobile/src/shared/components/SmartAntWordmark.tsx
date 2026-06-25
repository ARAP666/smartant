import { StyleSheet, Text } from "react-native";

export function SmartAntWordmark() {
  return (
    <Text accessibilityRole="header" style={styles.wordmark}>
      Smart Ant
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    color: "#173F35",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
