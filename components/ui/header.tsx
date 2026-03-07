import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  AnimatedRef,
  interpolate,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";

interface HeaderProps {
  scrollRef?: AnimatedRef<Animated.ScrollView> | null;
  title?: string;
}

export default function Header({ scrollRef, title }: HeaderProps) {
  const scrollOffset = useScrollOffset(scrollRef || null);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollOffset.value, [0, 200], [1, 0.7], "clamp"),
        },
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, 200],
            [0, -10],
            "clamp",
          ),
        },
      ],
      opacity: interpolate(
        scrollOffset.value,
        [0, 150, 200],
        [1, 0.8, 0.6],
        "clamp",
      ),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollOffset.value, [0, 200], [1, 0.8], "clamp"),
        },
        {
          translateX: interpolate(
            scrollOffset.value,
            [0, 200],
            [0, -20],
            "clamp",
          ),
        },
      ],
      opacity: interpolate(
        scrollOffset.value,
        [0, 150, 250],
        [1, 0.7, 0.4],
        "clamp",
      ),
    };
  });

  return (
    <ThemedView style={styles.header}>
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </Animated.View>
      <Animated.View style={textAnimatedStyle}>
        <ThemedText type="title" style={styles.companyName}>
          {title || "Astralis"}
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 32,
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  logo: {
    width: 80,
    height: 80,
  },

  companyName: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#F4F7FF",
    fontFamily: "Sora-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
