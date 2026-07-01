import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState("");
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

  async function enableBiometrics() {
    if (!(await LocalAuthentication.hasHardwareAsync())) {
      setBiometricMessage("Este dispositivo no tiene biometría disponible.");
      return;
    }
    if (!(await LocalAuthentication.isEnrolledAsync())) {
      setBiometricMessage(
        "Primero configurá huella o rostro en el dispositivo.",
      );
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      biometricsSecurityLevel: "strong",
      promptMessage: "Activar acceso biométrico",
    });
    if (!result.success) {
      setBiometricMessage("No se activó la biometría.");
      return;
    }
    await SecureStore.setItemAsync("smartant.biometric-enabled", "true");
    setBiometricMessage("Acceso biométrico activado en este dispositivo.");
  }

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
      <Pressable
        accessibilityLabel={`Moneda seleccionada: ${currency}`}
        accessibilityRole="button"
        onPress={() => setCurrencyOpen((open) => !open)}
        style={styles.input}
      >
        <Text style={styles.inputText}>
          {currency} ·{" "}
          {currency === "CRC" ? "Colón costarricense" : "Dólar estadounidense"}
        </Text>
      </Pressable>
      {currencyOpen ? (
        <View accessibilityRole="menu" style={styles.menu}>
          {(["CRC", "USD"] as const).map((option) => (
            <Pressable
              accessibilityRole="menuitem"
              key={option}
              onPress={() => {
                setCurrency(option);
                setCurrencyOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.inputText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
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
      <Card>
        <Text style={styles.profileName}>Seguridad</Text>
        <Text style={styles.muted}>
          Usá la biometría del dispositivo para proteger una sesión guardada.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={enableBiometrics}
          style={styles.outlineButton}
        >
          <Text style={styles.outlineText}>Activar biometría</Text>
        </Pressable>
        {biometricMessage ? (
          <Text style={styles.muted}>{biometricMessage}</Text>
        ) : null}
      </Card>
      <Card>
        <Text style={styles.profileName}>Privacidad y legal</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/legal/privacy" as never)}
          style={styles.menuItem}
        >
          <Text style={styles.outlineText}>Política de privacidad</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/legal/terms" as never)}
          style={styles.menuItem}
        >
          <Text style={styles.outlineText}>Términos de uso</Text>
        </Pressable>
      </Card>
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
  inputText: { color: colors.ink, fontFamily: fonts.body },
  label: { color: colors.ink, fontFamily: fonts.bodyBold },
  labelRow: { alignItems: "center", flexDirection: "row", gap: spacing[2] },
  muted: { color: colors.inkMuted, fontFamily: fonts.body },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  menuItem: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  outlineButton: {
    alignItems: "center",
    borderColor: colors.forest,
    borderRadius: radii.full,
    borderWidth: 1.5,
    justifyContent: "center",
    minHeight: 48,
    marginTop: spacing[3],
  },
  outlineText: { color: colors.forest, fontFamily: fonts.bodyBold },
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
