import { StyleSheet, Text, View } from "react-native";
import { SmartAntWordmark } from "@/shared/components/SmartAntWordmark";

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <SmartAntWordmark />
      <Text style={styles.title}>Inicio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 24,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#173F35",
    fontSize: 24,
    fontWeight: "700",
  },
});
