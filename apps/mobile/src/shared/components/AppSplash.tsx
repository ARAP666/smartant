import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, fonts } from "@/shared/theme";
import { SmartAntWordmark } from "./SmartAntWordmark";
import { getSplashDuration } from "./splash-motion";

type AppSplashProps = {
  onDone: () => void;
};

export function AppSplash({ onDone }: AppSplashProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = (reduceMotion: boolean) => {
      const duration = getSplashDuration(reduceMotion);
      if (reduceMotion) {
        opacity.setValue(1);
        timer = setTimeout(onDone, duration);
        return;
      }

      Animated.timing(opacity, {
        duration,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }).start(() => active && onDone());
    };

    AccessibilityInfo.isReduceMotionEnabled().then(
      (reduceMotion) => active && run(reduceMotion),
    );
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (reduceMotion) => {
        opacity.stopAnimation();
        run(reduceMotion);
      },
    );

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      subscription.remove();
    };
  }, [onDone, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <Image
          accessibilityLabel="Logo de SmartAnt"
          source={require("../../../assets/smartant-mark.png")}
          style={styles.mark}
        />
        <SmartAntWordmark />
        <Text style={styles.tagline}>Pequeños pasos, gran progreso</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.bg,
    flex: 1,
    justifyContent: "center",
  },
  mark: {
    alignSelf: "center",
    height: 180,
    marginBottom: 24,
    width: 180,
  },
  tagline: {
    color: colors.inkMuted,
    fontFamily: fonts.body,
    marginTop: 4,
    textAlign: "center",
  },
});
