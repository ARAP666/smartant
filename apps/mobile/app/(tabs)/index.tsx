import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchFinancialSummary } from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";
import { SmartAntWordmark } from "@/shared/components/SmartAntWordmark";

export default function HomeScreen() {
  const summary = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchFinancialSummary(token);
    },
  });

  return (
    <View style={styles.screen}>
      <SmartAntWordmark />
      <View style={styles.header}>
        <Text style={styles.title}>Inicio</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => summary.refetch()}
          style={styles.refresh}
        >
          <Text style={styles.refreshText}>
            {summary.isFetching ? "Actualizando" : "Actualizar"}
          </Text>
        </Pressable>
      </View>
      {summary.isLoading ? <Text>Cargando resumen</Text> : null}
      {summary.isError ? (
        <Text style={styles.error}>{summary.error.message}</Text>
      ) : null}
      {summary.data?.summary.empty ? (
        <Text>No hay datos financieros para este periodo</Text>
      ) : null}
      {summary.data && !summary.data.summary.empty ? (
        <View style={styles.grid}>
          <Metric label="Ingresos" value={summary.data.summary.incomeTotal} />
          <Metric label="Gastos" value={summary.data.summary.expenseTotal} />
          <Metric
            label="Meta de ahorro"
            value={summary.data.summary.savingsGoalTotal}
          />
          <Metric
            label="Presupuesto"
            value={summary.data.summary.budgetTotal}
          />
          <View style={styles.balance}>
            <Text style={styles.balanceLabel}>Saldo gastable</Text>
            <Text style={styles.balanceValue}>
              {summary.data.summary.spendableBalance}
            </Text>
          </View>
          <Text style={styles.period}>
            {summary.data.summary.period.start} /{" "}
            {summary.data.summary.period.end}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    backgroundColor: "#173F35",
    borderRadius: 8,
    gap: 6,
    padding: 16,
  },
  balanceLabel: { color: "#D7E7DE", fontWeight: "700" },
  balanceValue: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  error: { color: "#9B1C1C" },
  grid: { gap: 12 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    borderColor: "#D7E7DE",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  metricLabel: { color: "#517067", fontWeight: "700" },
  metricValue: { color: "#173F35", fontSize: 22, fontWeight: "800" },
  period: { color: "#517067", fontWeight: "700" },
  refresh: {
    alignItems: "center",
    backgroundColor: "#176B55",
    borderRadius: 8,
    minHeight: 40,
    minWidth: 104,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  refreshText: { color: "#FFFFFF", fontWeight: "700" },
  screen: {
    flex: 1,
    gap: 18,
    padding: 24,
  },
  title: {
    color: "#173F35",
    fontSize: 24,
    fontWeight: "700",
  },
});
