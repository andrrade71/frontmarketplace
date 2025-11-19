import { Ionicons } from "@expo/vector-icons";

export function HomeIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return <Ionicons name="home" size={size} color={color} {...props} />;
}
