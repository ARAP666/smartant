import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  type ImportFile,
  validateImportFile,
} from "@/features/imports/import-file";
import {
  canContinueImport,
  type ImportColumnRole,
  type ImportMapping,
  suggestImportMapping,
} from "@/features/imports/import-mapping";
import {
  buildImportPreviewRows,
  classifyImportRows,
  parseCsvImport,
} from "@/features/imports/import-preview";
import { incomeSchema } from "@/features/incomes/income-schema";
import { pendingMovementSchema } from "@/features/pending-movements/pending-movement-schema";
import {
  type ReceiptPhoto,
  validateReceiptPhoto,
} from "@/features/receipts/receipt-photo";
import {
  confirmImport,
  confirmPendingMovement,
  createIncome,
  deleteExpense,
  detectReceipt,
  evaluatePendingMovement,
  reviewPendingMovement,
  updateExpense,
} from "@/shared/api/client";
import { getSessionToken } from "@/shared/auth/session";

export default function AddScreen() {
  const queryClient = useQueryClient();
  const [amountMinor, setAmountMinor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [importFile, setImportFile] = useState<ImportFile | null>(null);
  const [importText, setImportText] = useState("");
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importMapping, setImportMapping] = useState<ImportMapping>({});
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [receiptPhoto, setReceiptPhoto] = useState<ReceiptPhoto | null>(null);
  const [receiptPendingMovementId, setReceiptPendingMovementId] = useState("");
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
  const evaluate = useMutation({
    mutationFn: async () => {
      const parsed = pendingMovementSchema.safeParse({
        amountMinor: expenseAmount,
        date: expenseDate,
        description: expenseDescription,
        category: expenseCategory,
      });
      if (!parsed.success) {
        setFormError("Revisa gasto, fecha, descripcion y categoria");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return receiptPendingMovementId
        ? reviewPendingMovement(token, receiptPendingMovementId, parsed.data)
        : evaluatePendingMovement(token, parsed.data);
    },
  });
  const confirm = useMutation({
    mutationFn: async () => {
      const pendingMovementId = evaluate.data?.pendingMovement.id;
      if (!pendingMovementId) {
        setFormError("Evalua el gasto antes de confirmar");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return confirmPendingMovement(token, pendingMovementId);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setExpenseAmount(data.expense.amountMinor);
      setExpenseDate(data.expense.date);
      setExpenseDescription(data.expense.description);
      setExpenseCategory(data.expense.category);
    },
  });
  const confirmedExpense = confirm.data?.expense;
  const editExpense = useMutation({
    mutationFn: async () => {
      if (!confirmedExpense) {
        setFormError("Confirma un gasto antes de editar");
        return null;
      }
      const parsed = pendingMovementSchema.safeParse({
        amountMinor: expenseAmount,
        date: expenseDate,
        description: expenseDescription,
        category: expenseCategory,
      });
      if (!parsed.success) {
        setFormError("Revisa gasto, fecha, descripcion y categoria");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return updateExpense(token, confirmedExpense.id, parsed.data);
    },
  });
  const removeExpense = useMutation({
    mutationFn: async () => {
      if (!confirmedExpense) {
        setFormError("Confirma un gasto antes de eliminar");
        return;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      await deleteExpense(token, confirmedExpense.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setExpenseAmount("");
      setExpenseDescription("");
      setExpenseCategory("");
    },
  });
  async function selectReceiptPhoto(source: "camera" | "gallery") {
    const token = await getSessionToken();
    if (!token) {
      setFormError("Sesion requerida");
      return;
    }
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError("Permiso rechazado. Puedes registrar el gasto manualmente.");
      return;
    }
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          });
    if (result.canceled) return;
    const photo = result.assets[0];
    if (!photo) return;
    const validationError = validateReceiptPhoto(photo);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setReceiptPhoto(photo);
    setFormError("");
  }
  const detect = useMutation({
    mutationFn: async () => {
      if (!receiptPhoto) {
        setFormError("Selecciona una foto primero");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return detectReceipt(token, receiptPhoto);
    },
    onSuccess: (data) => {
      if (!data) return;
      setExpenseAmount(data.detected.amountMinor);
      setExpenseDate(data.detected.date);
      setExpenseDescription(data.detected.description);
      setExpenseCategory(data.detected.category);
      setReceiptPendingMovementId(data.pendingMovement.id);
    },
  });
  function cancelReceiptReview() {
    setReceiptPhoto(null);
    setReceiptPendingMovementId("");
    setFormError("");
  }
  async function selectImportFile() {
    const token = await getSessionToken();
    if (!token) {
      setFormError("Sesion requerida");
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    });
    if (result.canceled) return;
    const file = result.assets[0];
    if (!file) return;
    const validationError = validateImportFile(file);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFormError("Por ahora importa CSV. XLSX queda para el parser final.");
      return;
    }
    const text = await fetch(file.uri).then((response) => response.text());
    const headers = parseCsvImport(text).headers;
    if (headers.length === 0) {
      setFormError("El CSV no tiene encabezados");
      return;
    }
    setImportFile(file);
    setImportText(text);
    setImportHeaders(headers);
    setImportMapping(suggestImportMapping(headers));
    setSelectedImportRows([]);
    setFormError("");
  }
  function assignImportColumn(role: ImportColumnRole) {
    const current = importMapping[role];
    const currentIndex = current ? importHeaders.indexOf(current) : -1;
    const next = importHeaders[(currentIndex + 1) % importHeaders.length];
    setImportMapping((mapping) => ({ ...mapping, [role]: next }));
  }
  const previewRows =
    importFile && importText
      ? classifyImportRows(buildImportPreviewRows(importText, importMapping))
      : [];
  function toggleImportRow(rowId: string) {
    const row = previewRows.find((candidate) => candidate.id === rowId);
    if (row?.status !== "VALID") return;
    setSelectedImportRows((rows) =>
      rows.includes(rowId)
        ? rows.filter((current) => current !== rowId)
        : [...rows, rowId],
    );
  }
  const selectedValidImportRows = previewRows.filter(
    (row) => row.status === "VALID" && selectedImportRows.includes(row.id),
  );
  const confirmSelectedImport = useMutation({
    mutationFn: async () => {
      if (!importFile || selectedValidImportRows.length === 0) {
        setFormError("Selecciona filas validas para importar");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesion requerida");
      setFormError("");
      return confirmImport(token, {
        idempotencyKey:
          `import-${importFile.name}-${importFile.size ?? 0}`.slice(0, 120),
        rows: selectedValidImportRows.map((row) => ({
          rowId: row.id,
          amountMinor: row.amountMinor ?? "0",
          date: row.date ?? "",
          description: row.description ?? row.id,
          category: row.category ?? "Importado",
        })),
      });
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries();
      setSelectedImportRows([]);
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
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
      <Text style={styles.title}>Evaluar gasto</Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={selectImportFile}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Importar CSV/XLSX</Text>
        </Pressable>
      </View>
      {importFile ? <Text>Archivo listo: {importFile.name}</Text> : null}
      {importFile ? (
        <View style={styles.importBox}>
          {(["date", "amount", "description", "category"] as const).map(
            (role) => (
              <Pressable
                accessibilityRole="button"
                key={role}
                onPress={() => assignImportColumn(role)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>
                  {role}: {importMapping[role] ?? "Sin asignar"}
                </Text>
              </Pressable>
            ),
          )}
          <Text>
            Muestra: {importMapping.date ?? "Fecha"} /{" "}
            {importMapping.amount ?? "Monto"}
          </Text>
          {!canContinueImport(importMapping) ? (
            <Text style={styles.error}>Fecha y monto son obligatorios</Text>
          ) : null}
          {previewRows.map((row) => (
            <Pressable
              accessibilityRole="button"
              key={row.id}
              onPress={() => toggleImportRow(row.id)}
              style={[
                styles.previewRow,
                selectedImportRows.includes(row.id) && styles.previewSelected,
              ]}
            >
              <Text style={styles.label}>
                {row.status}: {row.description ?? row.id}
              </Text>
              <Text>
                {row.date ?? "Sin fecha"} / {row.amountMinor ?? "Sin monto"}
              </Text>
              {row.reason ? <Text>{row.reason}</Text> : null}
            </Pressable>
          ))}
          <Text>{selectedImportRows.length} filas validas seleccionadas</Text>
          <Pressable
            accessibilityRole="button"
            disabled={
              confirmSelectedImport.isPending ||
              !canContinueImport(importMapping) ||
              selectedValidImportRows.length === 0
            }
            onPress={() => confirmSelectedImport.mutate()}
            style={[
              styles.button,
              (confirmSelectedImport.isPending ||
                selectedValidImportRows.length === 0) &&
                styles.disabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {confirmSelectedImport.isPending
                ? "Importando..."
                : "Confirmar importacion"}
            </Text>
          </Pressable>
          {confirmSelectedImport.data ? (
            <Text>
              Importadas: {confirmSelectedImport.data.created} / Omitidas:{" "}
              {confirmSelectedImport.data.skipped}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => selectReceiptPhoto("camera")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Camara</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => selectReceiptPhoto("gallery")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Galeria</Text>
        </Pressable>
      </View>
      {receiptPhoto ? <Text>Foto lista: {receiptPhoto.uri}</Text> : null}
      {receiptPhoto ? (
        <Pressable
          accessibilityRole="button"
          disabled={detect.isPending}
          onPress={() => detect.mutate()}
          style={[styles.button, detect.isPending && styles.disabled]}
        >
          <Text style={styles.buttonText}>
            {detect.isPending ? "Detectando..." : "Detectar recibo"}
          </Text>
        </Pressable>
      ) : null}
      {receiptPendingMovementId ? (
        <Pressable
          accessibilityRole="button"
          onPress={cancelReceiptReview}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Cancelar recibo</Text>
        </Pressable>
      ) : null}
      <TextInput
        accessibilityLabel="Monto gasto"
        keyboardType="number-pad"
        onChangeText={setExpenseAmount}
        style={styles.input}
        value={expenseAmount}
      />
      <TextInput
        accessibilityLabel="Fecha gasto"
        onChangeText={setExpenseDate}
        style={styles.input}
        value={expenseDate}
      />
      <TextInput
        accessibilityLabel="Descripcion gasto"
        onChangeText={setExpenseDescription}
        style={styles.input}
        value={expenseDescription}
      />
      <TextInput
        accessibilityLabel="Categoria gasto"
        onChangeText={setExpenseCategory}
        style={styles.input}
        value={expenseCategory}
      />
      <Pressable
        accessibilityRole="button"
        disabled={evaluate.isPending}
        onPress={() => evaluate.mutate()}
        style={[styles.button, evaluate.isPending && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {evaluate.isPending ? "Evaluando..." : "Evaluar gasto"}
        </Text>
      </Pressable>
      {evaluate.data ? (
        <Text>Saldo gastable: {evaluate.data.evaluation.spendableBalance}</Text>
      ) : null}
      {evaluate.data?.evaluation.alerts?.map((alert) => (
        <Text key={`${alert.severity}-${alert.rule}`} style={styles.alert}>
          {alert.severity}: {alert.rule} - {alert.spendableBalance}
        </Text>
      ))}
      {evaluate.data ? (
        <Pressable
          accessibilityRole="button"
          disabled={confirm.isPending}
          onPress={() => confirm.mutate()}
          style={[styles.button, confirm.isPending && styles.disabled]}
        >
          <Text style={styles.buttonText}>
            {confirm.isPending ? "Confirmando..." : "Confirmar gasto"}
          </Text>
        </Pressable>
      ) : null}
      {confirmedExpense ? (
        <>
          <Pressable
            accessibilityRole="button"
            disabled={editExpense.isPending}
            onPress={() => editExpense.mutate()}
            style={[styles.button, editExpense.isPending && styles.disabled]}
          >
            <Text style={styles.buttonText}>
              {editExpense.isPending ? "Guardando..." : "Guardar cambios gasto"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={removeExpense.isPending}
            onPress={() => removeExpense.mutate()}
            style={[
              styles.dangerButton,
              removeExpense.isPending && styles.disabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {removeExpense.isPending ? "Eliminando..." : "Eliminar gasto"}
            </Text>
          </Pressable>
        </>
      ) : null}
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      {save.isError ? (
        <Text style={styles.error}>{save.error.message}</Text>
      ) : null}
      {evaluate.isError ? (
        <Text style={styles.error}>{evaluate.error.message}</Text>
      ) : null}
      {confirm.isError ? (
        <Text style={styles.error}>{confirm.error.message}</Text>
      ) : null}
      {detect.isError ? (
        <Text style={styles.error}>{detect.error.message}</Text>
      ) : null}
      {confirmSelectedImport.isError ? (
        <Text style={styles.error}>{confirmSelectedImport.error.message}</Text>
      ) : null}
      {editExpense.isError ? (
        <Text style={styles.error}>{editExpense.error.message}</Text>
      ) : null}
      {removeExpense.isError ? (
        <Text style={styles.error}>{removeExpense.error.message}</Text>
      ) : null}
      {save.isSuccess && !formError ? <Text>Ingreso guardado</Text> : null}
      {confirm.isSuccess && !formError ? <Text>Gasto confirmado</Text> : null}
      {editExpense.isSuccess && !formError ? (
        <Text>Gasto actualizado</Text>
      ) : null}
      {removeExpense.isSuccess && !formError ? (
        <Text>Gasto eliminado</Text>
      ) : null}
      {confirmSelectedImport.isSuccess && !formError ? (
        <Text>Importacion confirmada</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", gap: 8 },
  button: {
    alignItems: "center",
    backgroundColor: "#176B55",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
  disabled: { opacity: 0.6 },
  dangerButton: {
    alignItems: "center",
    backgroundColor: "#9B1C1C",
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 48,
  },
  error: { color: "#9B1C1C" },
  input: {
    borderColor: "#9AA8A3",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  label: { color: "#173F35", fontWeight: "700" },
  alert: { color: "#173F35", fontWeight: "700" },
  importBox: { gap: 8 },
  previewRow: {
    borderColor: "#D7E7DE",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  previewSelected: { borderColor: "#176B55", borderWidth: 2 },
  screen: { gap: 12, padding: 24 },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#176B55",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  secondaryText: { color: "#176B55", fontWeight: "700" },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
