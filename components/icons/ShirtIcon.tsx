import { Ionicons } from "@expo/vector-icons";

export function ShirtIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return <Ionicons name="shirt" size={size} color={color} {...props} />;
}
