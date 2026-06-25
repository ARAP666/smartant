import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { salarySchema } from "@/features/salary/salary-schema";
import {
  deleteSalary,
  fetchSalary,
  generateSalary,
  pauseSalary,
  saveSalary,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";

export default function PlanScreen() {
  const queryClient = useQueryClient();
  const [amountMinor, setAmountMinor] = useState("");
  const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY">("MONTHLY");
  const [nextDate, setNextDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [formError, setFormError] = useState("");
  const salary = useQuery({
    queryKey: ["salary"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchSalary(token);
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

  useEffect(() => {
    const current = salary.data?.salary;
    if (!current) return;
    setAmountMinor(current.amountMinor);
    setFrequency(current.frequency);
    setNextDate(current.nextDate);
  }, [salary.data]);

  const current = salary.data?.salary;

  return (
    <View style={styles.screen}>
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
    </View>
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
