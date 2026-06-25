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
        <TextInput
          accessibilityLabel="Correo"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="ana@example.com"
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
    backgroundColor: "#176B55",
    borderRadius: 10,
    minHeight: 48,
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.55 },
  error: { color: "#9B1C1C" },
  form: { gap: 12, width: "100%" },
  input: {
    borderColor: "#7B8B86",
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  link: { color: "#176B55", minHeight: 44, paddingVertical: 12 },
  screen: {
    backgroundColor: "#F7FBF7",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  success: { color: "#176B55" },
  title: { color: "#173F35", fontSize: 24, fontWeight: "700" },
});
