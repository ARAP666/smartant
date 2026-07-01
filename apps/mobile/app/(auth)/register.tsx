import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { registerSchema } from "@/features/auth/register-schema";
import { registerAccount } from "@/shared/api/client";
import { saveSessionToken } from "@/shared/auth/session";
import { SmartAntWordmark } from "@/shared/components/SmartAntWordmark";
import { colors, fonts, radii, spacing } from "@/shared/theme";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const mutation = useMutation({
    mutationFn: registerAccount,
    onSuccess: async ({ sessionToken }) => {
      await saveSessionToken(sessionToken);
      router.replace("/(tabs)");
    },
  });

  const submit = () => {
    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    mutation.mutate(parsed.data);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.form}>
        <SmartAntWordmark />
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Empezá con una vista clara de tu dinero.
        </Text>
        <TextInput
          accessibilityLabel="Correo"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="vos@correo.com"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          value={email}
        />
        {fieldErrors.email?.[0] ? (
          <Text style={styles.error}>{fieldErrors.email[0]}</Text>
        ) : null}
        <TextInput
          accessibilityLabel="Contraseña"
          autoComplete="new-password"
          onChangeText={setPassword}
          placeholder="Mínimo 12 caracteres"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {fieldErrors.password?.[0] ? (
          <Text style={styles.error}>{fieldErrors.password[0]}</Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          disabled={mutation.isPending}
          onPress={submit}
          style={[styles.button, mutation.isPending && styles.disabled]}
        >
          <Text style={styles.buttonText}>
            {mutation.isPending ? "Creando cuenta…" : "Crear cuenta"}
          </Text>
        </Pressable>
        {mutation.isError ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {mutation.error.message}
          </Text>
        ) : null}
        {mutation.isSuccess ? (
          <Text accessibilityLiveRegion="polite" style={styles.success}>
            Cuenta creada
          </Text>
        ) : null}
        <Link href="/login" style={styles.link}>
          Ya tengo una cuenta
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.full,
    minHeight: 48,
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 16 },
  disabled: { opacity: 0.55 },
  error: { color: colors.red, fontFamily: fonts.bodyMedium },
  form: { gap: spacing[4], width: "100%" },
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
  link: {
    color: colors.forestStrong,
    fontFamily: fonts.bodyBold,
    minHeight: 44,
    paddingVertical: 12,
  },
  screen: {
    backgroundColor: colors.bg,
    flex: 1,
    justifyContent: "center",
    padding: spacing[6],
  },
  subtitle: { color: colors.inkMuted, fontFamily: fonts.body },
  success: { color: colors.forest, fontFamily: fonts.bodyMedium },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
  },
});
