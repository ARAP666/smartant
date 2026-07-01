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
import { StyleSheet, View } from "react-native";
import { tabs } from "@/navigation/tabs";
import {
  loadCurrentSession,
  SESSION_QUERY_KEY,
} from "@/shared/auth/current-session";
import { colors, fonts, radii } from "@/shared/theme";

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
        animation: "fade",
        headerShown: false,
        tabBarActiveTintColor: colors.forestStrong,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
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
              tabBarIcon: ({ color, size }) =>
                tab.name === "add" ? (
                  <View style={styles.addCircle}>
                    <Icon color={colors.white} size={size} strokeWidth={2.5} />
                  </View>
                ) : (
                  <Icon color={color} size={size} strokeWidth={1.9} />
                ),
              title: tab.label,
            }}
          />
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addCircle: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderColor: colors.surface,
    borderRadius: radii.full,
    borderWidth: 4,
    height: 56,
    justifyContent: "center",
    marginTop: -24,
    width: 56,
  },
  bar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 76,
    paddingBottom: 8,
    paddingTop: 10,
  },
  label: { fontFamily: fonts.bodyMedium, fontSize: 11 },
});
