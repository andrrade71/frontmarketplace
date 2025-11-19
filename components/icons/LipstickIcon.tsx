import { MaterialCommunityIcons } from "@expo/vector-icons";

export function LipstickIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name="lipstick"
      size={size}
      color={color}
      {...props}
    />
  );
}
