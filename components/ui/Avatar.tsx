import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Image, ImageProps, StyleSheet } from "react-native";

export type AvatarProps = {
  source?: ImageProps["source"];
  name?: string;
  size?: number;
};

export function Avatar({ source, name, size = 40 }: AvatarProps) {
  const { colors } = useTheme();

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
        {name ? getInitials(name) : "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
