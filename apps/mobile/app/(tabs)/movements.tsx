import { StyleSheet, Text, View } from "react-native";

export default function MovementsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Movimientos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 24 },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
