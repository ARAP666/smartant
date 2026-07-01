import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationBar } from "expo-navigation-bar";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { AppSplash } from "@/shared/components/AppSplash";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const finishSplash = useCallback(() => setReady(true), []);

  return (
    <>
      <StatusBar hidden />
      <NavigationBar hidden />
      {ready ? (
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      ) : (
        <AppSplash onDone={finishSplash} />
      )}
    </>
  );
}
