import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import {
  loadCurrentSession,
  SESSION_QUERY_KEY,
} from "@/shared/auth/current-session";

export default function IndexScreen() {
  const session = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: loadCurrentSession,
    retry: false,
  });

  if (session.isPending) {
    return (
      <View accessibilityLabel="Comprobando sesión">
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={session.data ? "/(tabs)" : "/login"} />;
}
