import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Category } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  categories: Category[];
  initialFilters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export function FilterModal({
  visible,
  onClose,
  onApply,
  categories,
  initialFilters,
}: FilterModalProps) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialFilters?.categoryId
  );
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters?.minPrice?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters?.maxPrice?.toString() || ""
  );

  useEffect(() => {
    if (visible) {
      setSelectedCategory(initialFilters?.categoryId);
      setMinPrice(initialFilters?.minPrice?.toString() || "");
      setMaxPrice(initialFilters?.maxPrice?.toString() || "");
    }
  }, [visible, initialFilters]);

  const handleApply = () => {
    onApply({
      categoryId: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory(undefined);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text type="subtitle">Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categories}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !selectedCategory && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setSelectedCategory(undefined)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    !selectedCategory && { color: "#fff" },
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.id && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.id && { color: "#fff" },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Faixa de Preço</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currency}>R$</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Mínimo"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
              <Text style={styles.separator}>-</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currency}>R$</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Máximo"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "45%",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryChipText: {
    fontSize: 14,
  },
  priceInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    marginRight: 4,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  separator: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  clearButton: {
    padding: 12,
  },
  applyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
