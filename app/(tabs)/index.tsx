import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import React from "react";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Header from "@/components/ui/header";

export default function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <LinearGradient colors={["#0B1220", "#0E1A33"]} style={styles.container}>
      <ParallaxScrollView
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <Header scrollRef={scrollRef} />
          </ThemedView>
        }
        headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
        scrollRef={scrollRef}
      >
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText style={styles.welcomeText}>Bem vindo</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    minHeight: 400,
    paddingVertical: 100,
    paddingBottom: 120,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F4F7FF",
    textAlign: "center",
    letterSpacing: 2,
  },
});
