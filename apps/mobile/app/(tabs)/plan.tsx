import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { budgetSchema } from "@/features/budgets/budget-schema";
import { salarySchema } from "@/features/salary/salary-schema";
import { savingsGoalSchema } from "@/features/savings-goals/savings-goal-schema";
import {
  createBudget,
  createSavingsGoal,
  deleteBudget,
  deleteSalary,
  deleteSavingsGoal,
  fetchBudgets,
  fetchSalary,
  fetchSavingsGoals,
  generateSalary,
  pauseSalary,
  saveSalary,
  updateBudget,
  updateSavingsGoal,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";
import { formatMoney } from "@/shared/format-money";
import { colors, fonts, radii, spacing } from "@/shared/theme";

export default function PlanScreen() {
  const queryClient = useQueryClient();
  const [amountMinor, setAmountMinor] = useState("");
  const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY">("MONTHLY");
  const [nextDate, setNextDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState<"WEEKLY" | "MONTHLY">(
    "MONTHLY",
  );
  const [budgetCategory, setBudgetCategory] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalPeriod, setGoalPeriod] = useState<"WEEKLY" | "MONTHLY">("MONTHLY");
  const [formError, setFormError] = useState("");
  const salary = useQuery({
    queryKey: ["salary"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchSalary(token);
    },
  });
  const budgets = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchBudgets(token);
    },
  });
  const savingsGoals = useQuery({
    queryKey: ["savingsGoals"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchSavingsGoals(token);
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      const parsed = salarySchema.safeParse({
        amountMinor,
        frequency,
        nextDate,
      });
      if (!parsed.success) {
        setFormError("Revisa monto, frecuencia y proxima fecha");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return saveSalary(token, parsed.data);
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(["salary"], data);
    },
  });
  const pause = useMutation({
    mutationFn: async (paused: boolean) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return pauseSalary(token, paused);
    },
    onSuccess: (data) => queryClient.setQueryData(["salary"], data),
  });
  const generate = useMutation({
    mutationFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return generateSalary(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary"] });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
  const remove = useMutation({
    mutationFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      await deleteSalary(token);
    },
    onSuccess: () => queryClient.setQueryData(["salary"], { salary: null }),
  });
  const saveBudget = useMutation({
    mutationFn: async () => {
      const parsed = budgetSchema.safeParse({
        amountMinor: budgetAmount,
        period: budgetPeriod,
        category: budgetCategory || undefined,
        active: true,
      });
      if (!parsed.success) {
        setFormError("Revisa monto, periodo y categoria");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return createBudget(token, parsed.data);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setBudgetAmount("");
      setBudgetCategory("");
    },
  });
  const toggleBudget = useMutation({
    mutationFn: async (budget: {
      id: string;
      amountMinor: string;
      period: "WEEKLY" | "MONTHLY";
      category?: string | null;
      active: boolean;
    }) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return updateBudget(token, budget.id, {
        amountMinor: budget.amountMinor,
        period: budget.period,
        category: budget.category ?? undefined,
        active: !budget.active,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
  const removeBudget = useMutation({
    mutationFn: async (id: string) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      await deleteBudget(token, id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
  const saveGoal = useMutation({
    mutationFn: async () => {
      const parsed = savingsGoalSchema.safeParse({
        amountMinor: goalAmount,
        period: goalPeriod,
        active: true,
      });
      if (!parsed.success) {
        setFormError("Revisa monto y periodo de meta");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return createSavingsGoal(token, parsed.data);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      setGoalAmount("");
    },
  });
  const toggleGoal = useMutation({
    mutationFn: async (goal: {
      id: string;
      amountMinor: string;
      period: "WEEKLY" | "MONTHLY";
      active: boolean;
    }) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return updateSavingsGoal(token, goal.id, {
        amountMinor: goal.amountMinor,
        period: goal.period,
        active: !goal.active,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });
  const removeGoal = useMutation({
    mutationFn: async (id: string) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      await deleteSavingsGoal(token, id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] }),
  });

  useEffect(() => {
    const current = salary.data?.salary;
    if (!current) return;
    setAmountMinor(current.amountMinor);
    setFrequency(current.frequency);
    setNextDate(current.nextDate);
  }, [salary.data]);

  const current = salary.data?.salary;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Plan</Text>
      <Text style={styles.intro}>
        Organizá lo que entra, cuánto podés usar y lo que querés proteger.
      </Text>
      <View style={styles.section}>
        <Text style={styles.label}>Salario recurrente</Text>
        <Text style={styles.sectionDescription}>
          Automatiza el ingreso que recibís con una frecuencia fija.
        </Text>
        <Text style={styles.fieldLabel}>Monto del salario</Text>
        <Text style={styles.helper}>
          Se guarda en céntimos: ₡620 000 se escribe 62000000.
        </Text>
        <TextInput
          accessibilityLabel="Monto menor"
          keyboardType="number-pad"
          onChangeText={setAmountMinor}
          placeholder="Ej. 62000000"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={amountMinor}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setFrequency("WEEKLY")}
            style={[
              styles.segment,
              frequency === "WEEKLY" && styles.segmentSelected,
            ]}
          >
            <Text>Semanal</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setFrequency("MONTHLY")}
            style={[
              styles.segment,
              frequency === "MONTHLY" && styles.segmentSelected,
            ]}
          >
            <Text>Mensual</Text>
          </Pressable>
        </View>
        <Text style={styles.fieldLabel}>Próxima fecha de pago</Text>
        <TextInput
          accessibilityLabel="Proxima fecha"
          onChangeText={setNextDate}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={nextDate}
        />
        <Pressable
          accessibilityRole="button"
          disabled={save.isPending}
          onPress={() => save.mutate()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Guardar salario</Text>
        </Pressable>
        {current ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => pause.mutate(!current.paused)}
              style={styles.secondaryButton}
            >
              <Text>{current.paused ? "Reanudar" : "Pausar"}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => generate.mutate()}
              style={styles.secondaryButton}
            >
              <Text>Registrar pago ahora</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => remove.mutate()}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        ) : null}
        {salary.isPending ? <Text>Cargando salario...</Text> : null}
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        {salary.isError ? (
          <Text style={styles.error}>{salary.error.message}</Text>
        ) : null}
        {save.isError ? (
          <Text style={styles.error}>{save.error.message}</Text>
        ) : null}
        {pause.isError ? (
          <Text style={styles.error}>{pause.error.message}</Text>
        ) : null}
        {generate.isError ? (
          <Text style={styles.error}>{generate.error.message}</Text>
        ) : null}
        {remove.isError ? (
          <Text style={styles.error}>{remove.error.message}</Text>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Presupuesto</Text>
        <Text style={styles.sectionDescription}>
          Poné un límite distinto para comida, ocio, transporte u otra
          categoría.
        </Text>
        <Text style={styles.fieldLabel}>Monto máximo</Text>
        <Text style={styles.helper}>
          Este límite solo aplica a la categoría y periodo elegidos.
        </Text>
        <TextInput
          accessibilityLabel="Monto presupuesto"
          keyboardType="number-pad"
          onChangeText={setBudgetAmount}
          placeholder="Ej. 10000000"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={budgetAmount}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setBudgetPeriod("WEEKLY")}
            style={[
              styles.segment,
              budgetPeriod === "WEEKLY" && styles.segmentSelected,
            ]}
          >
            <Text>Semanal</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setBudgetPeriod("MONTHLY")}
            style={[
              styles.segment,
              budgetPeriod === "MONTHLY" && styles.segmentSelected,
            ]}
          >
            <Text>Mensual</Text>
          </Pressable>
        </View>
        <Text style={styles.fieldLabel}>Categoría del presupuesto</Text>
        <TextInput
          accessibilityLabel="Categoria"
          onChangeText={setBudgetCategory}
          placeholder="General"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={budgetCategory}
        />
        <Pressable
          accessibilityRole="button"
          disabled={saveBudget.isPending}
          onPress={() => saveBudget.mutate()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Guardar presupuesto</Text>
        </Pressable>
        {budgets.isPending ? <Text>Cargando presupuestos...</Text> : null}
        {budgets.data?.budgets.map((budget) => (
          <View key={budget.id} style={styles.budgetRow}>
            <Text>
              {budget.category ?? "General"} - {budget.period} -{" "}
              {formatMoney(budget.amountMinor)}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  toggleBudget.mutate({
                    ...budget,
                    period: budget.period as "WEEKLY" | "MONTHLY",
                  })
                }
                style={styles.secondaryButton}
              >
                <Text>{budget.active ? "Desactivar" : "Activar"}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => removeBudget.mutate(budget.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {budgets.isError ? (
          <Text style={styles.error}>{budgets.error.message}</Text>
        ) : null}
        {saveBudget.isError ? (
          <Text style={styles.error}>{saveBudget.error.message}</Text>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Meta de ahorro</Text>
        <Text style={styles.sectionDescription}>
          Reservá dinero antes de calcular lo disponible para gastar.
        </Text>
        <Text style={styles.fieldLabel}>Monto que querés ahorrar</Text>
        <Text style={styles.helper}>
          La meta se reserva antes de calcular tu balance disponible.
        </Text>
        <TextInput
          accessibilityLabel="Monto meta"
          keyboardType="number-pad"
          onChangeText={setGoalAmount}
          placeholder="Ej. 30000000"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={goalAmount}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setGoalPeriod("WEEKLY")}
            style={[
              styles.segment,
              goalPeriod === "WEEKLY" && styles.segmentSelected,
            ]}
          >
            <Text>Semanal</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setGoalPeriod("MONTHLY")}
            style={[
              styles.segment,
              goalPeriod === "MONTHLY" && styles.segmentSelected,
            ]}
          >
            <Text>Mensual</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={saveGoal.isPending}
          onPress={() => saveGoal.mutate()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Guardar meta</Text>
        </Pressable>
        {savingsGoals.isPending ? <Text>Cargando metas...</Text> : null}
        {savingsGoals.data?.savingsGoals.map((goal) => (
          <View key={goal.id} style={styles.budgetRow}>
            <Text>
              {goal.period} - {formatMoney(goal.amountMinor)}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  toggleGoal.mutate({
                    ...goal,
                    period: goal.period as "WEEKLY" | "MONTHLY",
                  })
                }
                style={styles.secondaryButton}
              >
                <Text>{goal.active ? "Desactivar" : "Activar"}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => removeGoal.mutate(goal.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {savingsGoals.isError ? (
          <Text style={styles.error}>{savingsGoals.error.message}</Text>
        ) : null}
        {saveGoal.isError ? (
          <Text style={styles.error}>{saveGoal.error.message}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.full,
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: { color: colors.white, fontFamily: fonts.bodyBold },
  budgetRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    gap: 8,
    padding: spacing[3],
  },
  deleteButton: {
    alignItems: "center",
    borderColor: colors.red,
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  deleteText: { color: colors.red, fontFamily: fonts.bodyBold },
  error: { color: colors.red, fontFamily: fonts.bodyMedium },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    borderWidth: 1.5,
    color: colors.ink,
    fontFamily: fonts.body,
    minHeight: 52,
    paddingHorizontal: spacing[4],
  },
  label: { color: colors.ink, fontFamily: fonts.bodyBold },
  fieldLabel: { color: colors.inkMuted, fontFamily: fonts.bodyMedium },
  intro: { color: colors.inkMuted, fontFamily: fonts.body, lineHeight: 22 },
  helper: {
    color: colors.inkFaint,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  screen: {
    backgroundColor: colors.bg,
    flex: 1,
    gap: spacing[5],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[5],
  },
  sectionDescription: {
    color: colors.inkMuted,
    fontFamily: fonts.body,
    lineHeight: 21,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.forest,
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  segment: {
    borderColor: colors.borderStrong,
    borderRadius: radii.full,
    borderWidth: 1,
    padding: 12,
  },
  segmentSelected: { backgroundColor: colors.forestSoft },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 28 },
});
