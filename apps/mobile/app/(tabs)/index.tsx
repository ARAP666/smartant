import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  PiggyBank,
  RefreshCw,
  Sprout,
  Target,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { SummaryPeriod } from "@/features/summary/summary-schema";
import {
  fetchExpenseCategories,
  fetchFinancialSummary,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";
import {
  Card,
  IconChip,
  ScreenTitle,
} from "@/shared/components/DesignPrimitives";
import { SmartAntWordmark } from "@/shared/components/SmartAntWordmark";
import { formatMoney } from "@/shared/format-money";
import { colors, fonts, radii, spacing } from "@/shared/theme";

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
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <SmartAntWordmark />
          <ScreenTitle eyebrow="Hola" title="Tu periodo" />
        </View>
        <Pressable
          accessibilityLabel="Actualizar resumen"
          accessibilityRole="button"
          onPress={() => summary.refetch()}
          style={styles.refresh}
        >
          <RefreshCw color={colors.forestStrong} size={18} />
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
      {summary.isLoading ? (
        <Text style={styles.muted}>Cargando resumen…</Text>
      ) : null}
      {summary.isError ? (
        <Text style={styles.error}>{summary.error.message}</Text>
      ) : null}
      {data?.empty ? (
        <Card muted>
          <View style={styles.empty}>
            <IconChip Icon={Sprout} size={72} />
            <Text style={styles.cardTitle}>Así se ve cuando empezás</Text>
            <Text style={styles.muted}>
              Registrá tu primer movimiento y tu resumen aparecerá acá.
            </Text>
          </View>
        </Card>
      ) : null}
      {data && !data.empty ? (
        <View style={styles.grid}>
          <View style={styles.balance}>
            <Text style={styles.balanceLabel}>Balance disponible</Text>
            <Text style={styles.balanceValue}>
              {formatMoney(data.spendableBalance)}
            </Text>
            <View style={styles.flowRow}>
              <View>
                <Text style={styles.flowLabel}>Ingresos</Text>
                <Text style={styles.flowValue}>
                  {formatMoney(data.incomeTotal)}
                </Text>
              </View>
              <View>
                <Text style={styles.flowLabel}>Gastos</Text>
                <Text style={styles.flowValue}>
                  {formatMoney(data.expenseTotal)}
                </Text>
              </View>
            </View>
            {totalFlow > 0 ? (
              <View style={styles.chart}>
                <View style={[styles.chartIncome, { flex: incomeWidth }]} />
                <View
                  style={[styles.chartExpense, { flex: 1 - incomeWidth }]}
                />
              </View>
            ) : null}
          </View>
          <Card>
            <View style={styles.rewardRow}>
              <IconChip Icon={Flame} tone="honey" />
              <View style={styles.rewardText}>
                <Text style={styles.cardTitle}>Tu progreso</Text>
                <Text style={styles.muted}>
                  Retos y recompensas · Próximamente
                </Text>
              </View>
            </View>
          </Card>
          <View style={styles.metricGrid}>
            <Metric
              icon={PiggyBank}
              label="Meta de ahorro"
              value={formatMoney(data.savingsGoalTotal)}
            />
            <Metric
              icon={Target}
              label="Presupuesto"
              value={formatMoney(data.budgetTotal)}
            />
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
                    {formatMoney(category.amountMinor)} · {category.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PiggyBank;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Icon color={colors.forest} size={16} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    backgroundColor: colors.forest,
    borderRadius: radii.xl,
    gap: spacing[3],
    padding: spacing[6],
  },
  balanceLabel: {
    color: colors.white,
    fontFamily: fonts.bodyMedium,
    opacity: 0.8,
  },
  balanceValue: { color: colors.white, fontFamily: fonts.amount, fontSize: 32 },
  cardTitle: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 16 },
  empty: { alignItems: "center", gap: spacing[3] },
  error: { color: colors.red, fontFamily: fonts.bodyMedium },
  chart: {
    flexDirection: "row",
    height: 14,
    overflow: "hidden",
    borderRadius: radii.full,
  },
  chartExpense: { backgroundColor: colors.coral },
  chartIncome: { backgroundColor: colors.white },
  categories: { gap: spacing[2] },
  categoryRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing[1],
    padding: spacing[4],
  },
  flowLabel: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 12,
    opacity: 0.8,
  },
  flowRow: { flexDirection: "row", gap: spacing[7] },
  flowValue: { color: colors.white, fontFamily: fonts.amount, fontSize: 16 },
  grid: { gap: spacing[4] },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  identity: { gap: spacing[3] },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing[2],
    padding: spacing[4],
  },
  metricGrid: { flexDirection: "row", gap: spacing[3] },
  metricLabel: {
    color: colors.inkMuted,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  metricValue: { color: colors.ink, fontFamily: fonts.amount, fontSize: 16 },
  muted: { color: colors.inkMuted, fontFamily: fonts.body },
  period: {
    color: colors.inkFaint,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  refresh: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  rewardRow: { alignItems: "center", flexDirection: "row", gap: spacing[4] },
  rewardText: { flex: 1, gap: spacing[1] },
  segment: {
    alignItems: "center",
    borderRadius: radii.full,
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: colors.surface },
  segments: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.full,
    flexDirection: "row",
    padding: 4,
  },
  segmentText: { color: colors.inkMuted, fontFamily: fonts.bodyBold },
  segmentTextActive: { color: colors.forestStrong },
  screen: {
    backgroundColor: colors.bg,
    flexGrow: 1,
    gap: spacing[5],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
});
