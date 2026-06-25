import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SummaryPeriod } from "@/features/summary/summary-schema";
import {
  fetchExpenseCategories,
  fetchFinancialSummary,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";
import { SmartAntWordmark } from "@/shared/components/SmartAntWordmark";

let sessionPeriod: SummaryPeriod = "MONTHLY";

export default function HomeScreen() {
  const [period, setPeriod] = useState<SummaryPeriod>(sessionPeriod);
  const summary = useQuery({
    queryKey: ["financial-summary", period],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchFinancialSummary(token, period);
    },
  });
  const categories = useQuery({
    queryKey: ["expense-categories", period],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchExpenseCategories(token, period);
    },
  });
  const data = summary.data?.summary;
  const totalFlow = data
    ? Number(data.incomeTotal) + Number(data.expenseTotal)
    : 0;
  const incomeWidth =
    data && totalFlow > 0 ? Number(data.incomeTotal) / totalFlow : 0;

  function selectPeriod(nextPeriod: SummaryPeriod) {
    sessionPeriod = nextPeriod;
    setPeriod(nextPeriod);
  }

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
      <View style={styles.segments}>
        <Pressable
          accessibilityRole="button"
          onPress={() => selectPeriod("WEEKLY")}
          style={[styles.segment, period === "WEEKLY" && styles.segmentActive]}
        >
          <Text
            style={[
              styles.segmentText,
              period === "WEEKLY" && styles.segmentTextActive,
            ]}
          >
            Semana
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => selectPeriod("MONTHLY")}
          style={[styles.segment, period === "MONTHLY" && styles.segmentActive]}
        >
          <Text
            style={[
              styles.segmentText,
              period === "MONTHLY" && styles.segmentTextActive,
            ]}
          >
            Mes
          </Text>
        </Pressable>
      </View>
      {summary.isLoading ? <Text>Cargando resumen</Text> : null}
      {summary.isError ? (
        <Text style={styles.error}>{summary.error.message}</Text>
      ) : null}
      {data?.empty ? (
        <Text>No hay datos financieros para este periodo</Text>
      ) : null}
      {data && !data.empty ? (
        <View style={styles.grid}>
          <Metric label="Ingresos" value={data.incomeTotal} />
          <Metric label="Gastos" value={data.expenseTotal} />
          <Metric label="Meta de ahorro" value={data.savingsGoalTotal} />
          <Metric label="Presupuesto" value={data.budgetTotal} />
          {totalFlow > 0 ? (
            <View style={styles.chart}>
              <View style={[styles.chartIncome, { flex: incomeWidth }]} />
              <View style={[styles.chartExpense, { flex: 1 - incomeWidth }]} />
            </View>
          ) : null}
          <View style={styles.balance}>
            <Text style={styles.balanceLabel}>Saldo gastable</Text>
            <Text style={styles.balanceValue}>{data.spendableBalance}</Text>
          </View>
          <Text style={styles.period}>
            {data.period.start} / {data.period.end} / {data.period.timeZone}
          </Text>
          {categories.data?.categories.length ? (
            <View style={styles.categories}>
              {categories.data.categories.map((category) => (
                <View key={category.category} style={styles.categoryRow}>
                  <Text style={styles.metricLabel}>{category.category}</Text>
                  <Text style={styles.metricValue}>
                    {category.amountMinor} / {category.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
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
  chart: {
    flexDirection: "row",
    height: 12,
    overflow: "hidden",
    borderRadius: 6,
  },
  chartExpense: { backgroundColor: "#B84A3A" },
  chartIncome: { backgroundColor: "#176B55" },
  categories: { gap: 8 },
  categoryRow: {
    borderColor: "#D7E7DE",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
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
  segment: {
    alignItems: "center",
    borderColor: "#D7E7DE",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: "#173F35", borderColor: "#173F35" },
  segments: { flexDirection: "row", gap: 8 },
  segmentText: { color: "#173F35", fontWeight: "700" },
  segmentTextActive: { color: "#FFFFFF" },
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
