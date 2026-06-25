import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { useCallback, useState } from "react";
import { AppSplash } from "@/shared/components/AppSplash";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const finishSplash = useCallback(() => setReady(true), []);

  if (!ready) return <AppSplash onDone={finishSplash} />;

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
