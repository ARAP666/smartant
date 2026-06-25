import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  type IncomeInput,
  incomeSchema,
} from "@/features/incomes/income-schema";
import { deleteIncome, fetchIncomes, updateIncome } from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";

export default function MovementsScreen() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState<IncomeInput>({
    amountMinor: "",
    date: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const incomes = useQuery({
    queryKey: ["incomes"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchIncomes(token);
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      await deleteIncome(token, id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incomes"] }),
  });
  const save = useMutation({
    mutationFn: async () => {
      const parsed = incomeSchema.safeParse(draft);
      if (!parsed.success) {
        setFormError("Revisa monto, fecha y descripcion");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return updateIncome(token, editingId, parsed.data);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setEditingId("");
    },
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Movimientos</Text>
      {incomes.isPending ? <Text>Cargando ingresos...</Text> : null}
      {incomes.isError ? (
        <Text style={styles.error}>{incomes.error.message}</Text>
      ) : null}
      {incomes.data?.incomes.length === 0 ? <Text>No hay ingresos</Text> : null}
      {incomes.data?.incomes.map((income) => (
        <View key={income.id} style={styles.row}>
          {editingId === income.id ? (
            <View style={styles.edit}>
              <TextInput
                accessibilityLabel="Monto menor"
                editable={!save.isPending}
                keyboardType="number-pad"
                onChangeText={(amountMinor) =>
                  setDraft((current) => ({ ...current, amountMinor }))
                }
                style={styles.input}
                value={draft.amountMinor}
              />
              <TextInput
                accessibilityLabel="Fecha"
                editable={!save.isPending}
                onChangeText={(date) =>
                  setDraft((current) => ({ ...current, date }))
                }
                style={styles.input}
                value={draft.date}
              />
              <TextInput
                accessibilityLabel="Descripcion"
                editable={!save.isPending}
                onChangeText={(description) =>
                  setDraft((current) => ({ ...current, description }))
                }
                style={styles.input}
                value={draft.description}
              />
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={save.isPending}
                  onPress={() => save.mutate()}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveText}>Guardar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={save.isPending}
                  onPress={() => setEditingId("")}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.description}>{income.description}</Text>
                <Text>
                  {income.date} - {income.amountMinor}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={remove.isPending}
                  onPress={() => {
                    setEditingId(income.id);
                    setDraft({
                      amountMinor: income.amountMinor,
                      date: income.date,
                      description: income.description,
                    });
                  }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveText}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={remove.isPending}
                  onPress={() => remove.mutate(income.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ))}
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      {remove.isError ? (
        <Text style={styles.error}>{remove.error.message}</Text>
      ) : null}
      {save.isError ? (
        <Text style={styles.error}>{save.error.message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", gap: 8 },
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
  description: { color: "#173F35", fontWeight: "700" },
  edit: { flex: 1, gap: 8 },
  error: { color: "#9B1C1C" },
  input: {
    borderColor: "#9AA8A3",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#DDE5E1",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  saveButton: {
    alignItems: "center",
    borderColor: "#176B55",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  saveText: { color: "#176B55", fontWeight: "700" },
  screen: { flex: 1, gap: 12, padding: 24 },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
