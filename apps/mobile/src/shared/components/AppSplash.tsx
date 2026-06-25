import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
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
        <SmartAntWordmark />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F7FBF7",
    flex: 1,
    justifyContent: "center",
  },
});
