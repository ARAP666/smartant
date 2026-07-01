import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii, spacing } from "@/shared/theme";

type Tone = "forest" | "honey" | "coral" | "blue" | "red";

const tones = {
  blue: [colors.blueSoft, colors.blue],
  coral: [colors.coralSoft, colors.coralStrong],
  forest: [colors.forestSoft, colors.forestStrong],
  honey: [colors.honeySoft, colors.honeyStrong],
  red: [colors.redSoft, colors.red],
} as const;

export function IconChip({
  Icon,
  tone = "forest",
  size = 48,
}: {
  Icon: LucideIcon;
  tone?: Tone;
  size?: number;
}) {
  const [backgroundColor, color] = tones[tone];
  return (
    <View
      style={[
        styles.iconChip,
        {
          backgroundColor,
          borderRadius: size < 44 ? radii.sm : radii.md,
          height: size,
          width: size,
        },
      ]}
    >
      <Icon color={color} size={Math.round(size / 2)} strokeWidth={1.8} />
    </View>
  );
}

export function Card({
  children,
  muted = false,
}: PropsWithChildren<{ muted?: boolean }>) {
  return (
    <View style={[styles.card, muted && styles.cardMuted]}>{children}</View>
  );
}

export function PrimaryButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.primary, disabled && styles.disabled]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function ScreenTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[5],
  },
  cardMuted: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
  disabled: { opacity: 0.5 },
  eyebrow: {
    color: colors.forest,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  iconChip: { alignItems: "center", justifyContent: "center" },
  primary: {
    alignItems: "center",
    backgroundColor: colors.forest,
    borderRadius: radii.full,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing[6],
  },
  primaryText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 34,
  },
});
