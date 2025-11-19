import { Ionicons } from "@expo/vector-icons";

export function FootballIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return <Ionicons name="football" size={size} color={color} {...props} />;
}
