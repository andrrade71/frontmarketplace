import { Ionicons } from "@expo/vector-icons";

export function IPhoneIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Ionicons name="phone-portrait" size={size} color={color} {...props} />
  );
}
