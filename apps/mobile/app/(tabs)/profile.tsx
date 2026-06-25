import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { profileSchema } from "@/features/profile/profile-schema";
import { fetchProfile, logoutAccount, saveProfile } from "@/shared/api/client";
import { SESSION_QUERY_KEY } from "@/shared/auth/current-session";
import { deleteSessionToken, getSessionToken } from "@/shared/auth/session";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const [currency, setCurrency] = useState("CRC");
  const [timeZone, setTimeZone] = useState("America/Costa_Rica");
  const [formError, setFormError] = useState("");
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error("Sesión requerida");
      return fetchProfile(token);
    },
  });
  const logout = useMutation({
    mutationFn: async () => {
      const token = await getSessionToken();
      if (token) await logoutAccount(token);
      await deleteSessionToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      router.replace("/login");
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      const parsed = profileSchema.safeParse({ currency, timeZone });
      if (!parsed.success) {
        setFormError("Revisa moneda y zona horaria");
        return null;
      }
      const token = await getSessionToken();
      if (!token) throw new Error("Sesión requerida");
      setFormError("");
      return saveProfile(token, parsed.data);
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(["profile"], data);
    },
  });

  useEffect(() => {
    if (!profile.data) return;
    setCurrency(profile.data.profile.currency);
    setTimeZone(profile.data.profile.timeZone);
  }, [profile.data]);

  const disabled = save.isPending || profile.isPending;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Moneda</Text>
      <TextInput
        accessibilityLabel="Moneda"
        autoCapitalize="characters"
        editable={!disabled}
        maxLength={3}
        onChangeText={setCurrency}
        style={styles.input}
        value={currency}
      />
      <Text style={styles.label}>Zona horaria</Text>
      <TextInput
        accessibilityLabel="Zona horaria"
        autoCapitalize="none"
        editable={!disabled}
        onChangeText={setTimeZone}
        style={styles.input}
        value={timeZone}
      />
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => save.mutate()}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Text style={styles.buttonText}>
          {save.isPending ? "Guardando..." : "Guardar"}
        </Text>
      </Pressable>
      {profile.isPending ? <Text>Cargando perfil...</Text> : null}
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      {profile.isError ? (
        <Text style={styles.error}>{profile.error.message}</Text>
      ) : null}
      {save.isError ? (
        <Text style={styles.error}>{save.error.message}</Text>
      ) : null}
      {save.isSuccess && !formError ? <Text>Perfil guardado</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={logout.isPending}
        onPress={() => logout.mutate()}
        style={styles.secondaryButton}
      >
        <Text style={styles.buttonText}>
          {logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
        </Text>
      </Pressable>
      {logout.isError ? (
        <Text style={styles.error}>{logout.error.message}</Text>
      ) : null}
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
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#53645F",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 48,
  },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
