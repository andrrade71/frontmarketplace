import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export type LoadingProps = {
  message?: string;
  size?: "small" | "large";
};

export function Loading({ message, size = "large" }: LoadingProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text style={styles.message} color="textSecondary">
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
});
