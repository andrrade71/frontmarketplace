import { ColorName } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import {
  ScrollView as DefaultScrollView,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  ScrollViewProps,
  StyleSheet,
  TextInputProps,
  TextProps,
  ViewProps,
} from "react-native";

export type ThemedTextProps = TextProps & {
  color?: ColorName;
  type?: "default" | "title" | "subtitle" | "link" | "small";
};

export type ThemedViewProps = ViewProps & {
  color?: ColorName;
};

export type ThemedInputProps = TextInputProps & {
  color?: ColorName;
};

export function Text(props: ThemedTextProps) {
  const { style, color, type = "default", ...otherProps } = props;
  const { colors } = useTheme();

  const textColor = color ? colors[color] : colors.text;

  return (
    <DefaultText
      style={[
        { color: textColor },
        type === "title" && styles.title,
        type === "subtitle" && styles.subtitle,
        type === "link" && { color: colors.primary },
        type === "small" && styles.small,
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ThemedViewProps) {
  const { style, color, ...otherProps } = props;
  const { colors } = useTheme();

  const backgroundColor = color ? colors[color] : colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: ThemedInputProps) {
  const { style, color, ...otherProps } = props;
  const { colors } = useTheme();

  return (
    <DefaultTextInput
      style={[
        {
          color: colors.text,
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
        },
        style,
      ]}
      placeholderTextColor={colors.textTertiary}
      {...otherProps}
    />
  );
}

export function ScrollView(props: ScrollViewProps) {
  const { style, ...otherProps } = props;
  const { colors } = useTheme();

  return (
    <DefaultScrollView
      style={[{ backgroundColor: colors.background }, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
});
