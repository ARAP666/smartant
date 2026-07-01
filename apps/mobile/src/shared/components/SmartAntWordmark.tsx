import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/shared/theme";

export function SmartAntWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View accessibilityRole="header" style={styles.row}>
      {compact ? (
        <Text style={styles.compact}>SMA</Text>
      ) : (
        <>
          <Text style={[styles.wordmark, styles.smart]}>Smart</Text>
          <Text style={[styles.wordmark, styles.ant]}>Ant</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ant: { color: colors.honeyStrong },
  compact: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: -2,
  },
  row: { alignItems: "baseline", flexDirection: "row" },
  smart: { color: colors.forestStrong },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -1.4,
  },
});
