import { useQuery } from "@tanstack/react-query";
import { Redirect, Tabs } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
  ChartNoAxesColumn,
  House,
  List,
  Plus,
  User,
} from "lucide-react-native";
import { tabs } from "@/navigation/tabs";
import {
  loadCurrentSession,
  SESSION_QUERY_KEY,
} from "@/shared/auth/current-session";

const icons: Record<(typeof tabs)[number]["icon"], LucideIcon> = {
  Chart: ChartNoAxesColumn,
  House,
  List,
  Plus,
  User,
};

export default function TabsLayout() {
  const session = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: loadCurrentSession,
    retry: false,
  });

  if (session.isPending) return null;
  if (!session.data) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#176B55",
        tabBarInactiveTintColor: "#53645F",
      }}
    >
      {tabs.map((tab) => {
        const Icon = icons[tab.icon];
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarAccessibilityLabel: tab.label,
              tabBarIcon: ({ color, size }) => (
                <Icon color={color} size={size} />
              ),
              title: tab.label,
            }}
          />
        );
      })}
    </Tabs>
  );
}
