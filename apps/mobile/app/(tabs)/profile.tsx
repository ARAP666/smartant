import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Coins, Globe2, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { profileSchema } from "@/features/profile/profile-schema";
import { fetchProfile, logoutAccount, saveProfile } from "@/shared/api/client";
import { SESSION_QUERY_KEY } from "@/shared/auth/current-session";
import { deleteSessionToken, getSessionToken } from "@/shared/auth/session";
import {
  Card,
  IconChip,
  ScreenTitle,
} from "@/shared/components/DesignPrimitives";
import { colors, fonts, radii, spacing } from "@/shared/theme";

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
    <ScrollView contentContainerStyle={styles.screen}>
      <ScreenTitle eyebrow="Cuenta" title="Perfil" />
      <Card>
        <View style={styles.profileRow}>
          <IconChip Icon={User} size={64} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Mi cuenta</Text>
            <Text style={styles.muted}>
              {profile.data?.profile.email ?? "Cargando…"}
            </Text>
          </View>
        </View>
      </Card>
      <View style={styles.labelRow}>
        <Coins color={colors.blue} size={18} />
        <Text style={styles.label}>Moneda</Text>
      </View>
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
      <View style={styles.labelRow}>
        <Globe2 color={colors.blue} size={18} />
        <Text style={styles.label}>Zona horaria</Text>
      </View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.full,
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: { color: colors.white, fontFamily: fonts.bodyBold },
  disabled: { opacity: 0.6 },
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
  labelRow: { alignItems: "center", flexDirection: "row", gap: spacing[2] },
  muted: { color: colors.inkMuted, fontFamily: fonts.body },
  profileName: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 18 },
  profileRow: { alignItems: "center", flexDirection: "row", gap: spacing[4] },
  profileText: { flex: 1, gap: spacing[1] },
  screen: {
    backgroundColor: colors.bg,
    flexGrow: 1,
    gap: spacing[4],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.red,
    borderRadius: radii.full,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 48,
  },
});
