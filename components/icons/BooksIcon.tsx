import { Ionicons } from "@expo/vector-icons";

export function BooksIcon({
  size = 32,
  color = "#000000",
  ...props
}: {
  size?: number;
  color?: string;
}) {
  return <Ionicons name="book" size={size} color={color} {...props} />;
}
