import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { incomeSchema } from "@/features/incomes/income-schema";
import { createIncome } from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";

export default function AddScreen() {
  const queryClient = useQueryClient();
  const [amountMinor, setAmountMinor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const save = useMutation({
    mutationFn: async () => {
      const parsed = incomeSchema.safeParse({ amountMinor, date, description });
      if (!parsed.success) {
        setFormError("Revisa monto, fecha y descripcion");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return createIncome(token, parsed.data);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setAmountMinor("");
      setDescription("");
    },
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Anadir ingreso</Text>
      <Text style={styles.label}>Monto menor</Text>
      <TextInput
        accessibilityLabel="Monto menor"
        editable={!save.isPending}
        keyboardType="number-pad"
        onChangeText={setAmountMinor}
        style={styles.input}
        value={amountMinor}
      />
      <Text style={styles.label}>Fecha</Text>
      <TextInput
        accessibilityLabel="Fecha"
        editable={!save.isPending}
        onChangeText={setDate}
        style={styles.input}
        value={date}
      />
      <Text style={styles.label}>Descripcion</Text>
      <TextInput
        accessibilityLabel="Descripcion"
        editable={!save.isPending}
        onChangeText={setDescription}
        style={styles.input}
        value={description}
      />
      <Pressable
        accessibilityRole="button"
        disabled={save.isPending}
        onPress={() => save.mutate()}
        style={[styles.button, save.isPending && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {save.isPending ? "Guardando..." : "Guardar ingreso"}
        </Text>
      </Pressable>
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      {save.isError ? (
        <Text style={styles.error}>{save.error.message}</Text>
      ) : null}
      {save.isSuccess && !formError ? <Text>Ingreso guardado</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#176B55",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
  disabled: { opacity: 0.6 },
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
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
