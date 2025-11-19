import { Text, TextInput, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChangeText?: (text: string) => void;
};

export function SearchBar({
  placeholder = "Buscar produtos...",
  onSearch,
  onChangeText,
}: SearchBarProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const handleChangeText = (text: string) => {
    setQuery(text);
    onChangeText?.(text);
  };

  const handleSearch = () => {
    onSearch?.(query);
  };

  return (
    <View style={styles.container} color="background">
      <View style={styles.searchContainer} color="background">
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleChangeText("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
  },
  clearIcon: {
    fontSize: 18,
    padding: 4,
  },
});
