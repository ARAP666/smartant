import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { NavigationBar } from "expo-navigation-bar";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { AppSplash } from "@/shared/components/AppSplash";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold: require("@expo-google-fonts/fraunces/600SemiBold/Fraunces_600SemiBold.ttf"),
    Inter_400Regular: require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
    Inter_600SemiBold: require("@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf"),
    Inter_700Bold: require("@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf"),
    JetBrainsMono_600SemiBold: require("@expo-google-fonts/jetbrains-mono/600SemiBold/JetBrainsMono_600SemiBold.ttf"),
  });
  const [ready, setReady] = useState(false);
  const finishSplash = useCallback(() => setReady(true), []);

  return (
    <>
      <StatusBar hidden />
      <NavigationBar hidden />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {ready && fontsLoaded ? (
          <QueryClientProvider client={queryClient}>
            <Slot />
          </QueryClientProvider>
        ) : (
          <AppSplash onDone={finishSplash} />
        )}
      </KeyboardAvoidingView>
    </>
  );
}
