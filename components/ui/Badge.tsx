import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, ViewProps } from "react-native";

export type BadgeProps = ViewProps & {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "small" | "medium";
};

export function Badge({
  label,
  variant = "primary",
  size = "medium",
  style,
  ...props
}: BadgeProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.secondary;
      case "success":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
      case "info":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getSizeStyles = () => {
    return size === "small"
      ? { paddingVertical: 2, paddingHorizontal: 8, fontSize: 12 }
      : { paddingVertical: 4, paddingHorizontal: 10, fontSize: 14 };
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { fontSize: sizeStyles.fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
