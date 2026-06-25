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
import {
  createBudget,
  deleteBudget,
  deleteSalary,
  fetchBudgets,
  fetchSalary,
  generateSalary,
  pauseSalary,
  saveSalary,
  updateBudget,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";

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
      <Text style={styles.label}>Salario recurrente</Text>
      <TextInput
        accessibilityLabel="Monto menor"
        keyboardType="number-pad"
        onChangeText={setAmountMinor}
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
      <TextInput
        accessibilityLabel="Proxima fecha"
        onChangeText={setNextDate}
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
            <Text>Generar</Text>
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
      <Text style={styles.label}>Presupuesto</Text>
      <TextInput
        accessibilityLabel="Monto presupuesto"
        keyboardType="number-pad"
        onChangeText={setBudgetAmount}
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
      <TextInput
        accessibilityLabel="Categoria"
        onChangeText={setBudgetCategory}
        placeholder="General"
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
            {budget.amountMinor}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    alignItems: "center",
    backgroundColor: "#176B55",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
  budgetRow: { gap: 8, paddingVertical: 8 },
  deleteButton: {
    alignItems: "center",
    borderColor: "#9B1C1C",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  deleteText: { color: "#9B1C1C", fontWeight: "700" },
  error: { color: "#9B1C1C" },
  input: {
    borderColor: "#9AA8A3",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  label: { color: "#173F35", fontWeight: "700" },
  screen: { flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#176B55",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  segment: {
    borderColor: "#9AA8A3",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  segmentSelected: { backgroundColor: "#DDE5E1" },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
