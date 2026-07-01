import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { MovementType } from "@/features/history/history-schema";
import {
  type IncomeInput,
  incomeSchema,
} from "@/features/incomes/income-schema";
import { pendingMovementSchema } from "@/features/pending-movements/pending-movement-schema";
import {
  deleteExpense,
  deleteIncome,
  fetchMovementHistory,
  updateExpense,
  updateIncome,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";
import { colors, fonts, radii, spacing } from "@/shared/theme";

const pageSize = 20;

export default function MovementsScreen() {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);
  const [type, setType] = useState<MovementType | undefined>();
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingType, setEditingType] = useState<MovementType | undefined>();
  const [draft, setDraft] = useState<IncomeInput & { category?: string }>({
    amountMinor: "",
    date: "",
    description: "",
    category: "",
  });
  const [formError, setFormError] = useState("");
  const history = useQuery({
    queryKey: ["history", offset, type, category, from, to],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      return fetchMovementHistory(token, {
        offset,
        limit: pageSize,
        type,
        category,
        from,
        to,
      });
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      if (editingType === "EXPENSE") {
        const parsed = pendingMovementSchema.safeParse(draft);
        if (!parsed.success) {
          setFormError("Revisa monto, fecha, descripcion y categoria");
          return null;
        }
        setFormError("");
        return updateExpense(token, editingId, parsed.data);
      }
      const parsed = incomeSchema.safeParse(draft);
      if (!parsed.success) {
        setFormError("Revisa monto, fecha y descripcion");
        return null;
      }
      setFormError("");
      return updateIncome(token, editingId, parsed.data);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["history"] });
      setEditingId("");
    },
  });
  const remove = useMutation({
    mutationFn: async (movement: { id: string; type: MovementType }) => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      if (movement.type === "EXPENSE") return deleteExpense(token, movement.id);
      return deleteIncome(token, movement.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Movimientos</Text>
      <View style={styles.filters}>
        <TextInput
          accessibilityLabel="Desde"
          onChangeText={(value) => {
            setOffset(0);
            setFrom(value);
          }}
          placeholder="Desde"
          style={styles.input}
          value={from}
        />
        <TextInput
          accessibilityLabel="Hasta"
          onChangeText={(value) => {
            setOffset(0);
            setTo(value);
          }}
          placeholder="Hasta"
          style={styles.input}
          value={to}
        />
        <TextInput
          accessibilityLabel="Categoria"
          onChangeText={(value) => {
            setOffset(0);
            setCategory(value);
          }}
          placeholder="Categoria"
          style={styles.input}
          value={category}
        />
      </View>
      <View style={styles.actions}>
        <FilterButton
          active={!type}
          label="Todos"
          onPress={() => setType(undefined)}
        />
        <FilterButton
          active={type === "INCOME"}
          label="Ingresos"
          onPress={() => setType("INCOME")}
        />
        <FilterButton
          active={type === "EXPENSE"}
          label="Gastos"
          onPress={() => setType("EXPENSE")}
        />
      </View>
      {history.isPending ? <Text>Cargando movimientos...</Text> : null}
      {history.isError ? (
        <Text style={styles.error}>{history.error.message}</Text>
      ) : null}
      {history.data?.movements.length === 0 ? (
        <Text>No hay movimientos para estos filtros</Text>
      ) : null}
      {history.data?.movements.map((movement) => (
        <View key={`${movement.type}-${movement.id}`} style={styles.row}>
          {editingId === movement.id ? (
            <View style={styles.edit}>
              <TextInput
                accessibilityLabel="Monto menor"
                keyboardType="number-pad"
                onChangeText={(amountMinor) =>
                  setDraft((current) => ({ ...current, amountMinor }))
                }
                style={styles.input}
                value={draft.amountMinor}
              />
              <TextInput
                accessibilityLabel="Fecha"
                onChangeText={(date) =>
                  setDraft((current) => ({ ...current, date }))
                }
                style={styles.input}
                value={draft.date}
              />
              <TextInput
                accessibilityLabel="Descripcion"
                onChangeText={(description) =>
                  setDraft((current) => ({ ...current, description }))
                }
                style={styles.input}
                value={draft.description}
              />
              {editingType === "EXPENSE" ? (
                <TextInput
                  accessibilityLabel="Categoria gasto"
                  onChangeText={(nextCategory) =>
                    setDraft((current) => ({
                      ...current,
                      category: nextCategory,
                    }))
                  }
                  style={styles.input}
                  value={draft.category}
                />
              ) : null}
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => save.mutate()}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveText}>Guardar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setEditingId("")}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.movement}>
                <Text style={styles.description}>{movement.description}</Text>
                <Text>
                  {movement.type} / {movement.date} / {movement.amountMinor}
                </Text>
                {movement.category ? <Text>{movement.category}</Text> : null}
              </View>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setEditingId(movement.id);
                    setEditingType(movement.type);
                    setDraft({
                      amountMinor: movement.amountMinor,
                      date: movement.date,
                      description: movement.description,
                      category: movement.category ?? "",
                    });
                  }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveText}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => remove.mutate(movement)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      ))}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={offset === 0}
          onPress={() => setOffset(Math.max(0, offset - pageSize))}
          style={[styles.saveButton, offset === 0 && styles.disabled]}
        >
          <Text style={styles.saveText}>Anterior</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!history.data?.page.nextOffset}
          onPress={() => setOffset(history.data?.page.nextOffset ?? offset)}
          style={[
            styles.saveButton,
            !history.data?.page.nextOffset && styles.disabled,
          ]}
        >
          <Text style={styles.saveText}>Siguiente</Text>
        </Pressable>
      </View>
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      {remove.isError ? (
        <Text style={styles.error}>{remove.error.message}</Text>
      ) : null}
      {save.isError ? (
        <Text style={styles.error}>{save.error.message}</Text>
      ) : null}
    </ScrollView>
  );
}

function FilterButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.saveButton, active && styles.activeButton]}
    >
      <Text style={[styles.saveText, active && styles.activeText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  activeButton: { backgroundColor: colors.forest },
  activeText: { color: colors.white },
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
  description: { color: colors.ink, fontFamily: fonts.bodyBold },
  disabled: { opacity: 0.5 },
  edit: { flex: 1, gap: 8 },
  error: { color: colors.red, fontFamily: fonts.bodyMedium },
  filters: { gap: 8 },
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
  movement: { flex: 1, gap: 3 },
  row: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 8,
    paddingVertical: 12,
  },
  saveButton: {
    alignItems: "center",
    borderColor: colors.forest,
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  saveText: { color: colors.forest, fontFamily: fonts.bodyBold },
  screen: {
    backgroundColor: colors.bg,
    flexGrow: 1,
    gap: spacing[3],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 28 },
});
