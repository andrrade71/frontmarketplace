import { ScrollView, Text, View } from "@/components/Themed";
import { FilterModal, ProductCard, SearchBar } from "@/components/marketplace";
import { useTheme } from "@/context/ThemeContext";
import { getCategories } from "@/services/categories";
import {
  getAllProductsPaginated,
  getProductsByCategory,
  getProductsByPrice,
} from "@/services/products";
import { Category, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

export default function SearchScreen() {
  const { q, category } = useLocalSearchParams<{
    q?: string;
    category?: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }>({});

  useEffect(() => {
    if (category) {
      setActiveFilters((prev) => ({ ...prev, categoryId: category }));
    }
  }, [category]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let items: Product[] = [];

        if (
          activeFilters.minPrice !== undefined ||
          activeFilters.maxPrice !== undefined
        ) {
          const result = await getProductsByPrice(
            activeFilters.minPrice,
            activeFilters.maxPrice,
            1,
            50
          );
          items = result.products;
          if (activeFilters.categoryId) {
            items = items.filter(
              (p) => p.categoryId === activeFilters.categoryId
            );
          }
        } else if (activeFilters.categoryId) {
          items = await getProductsByCategory(activeFilters.categoryId);
        } else {
          const filters: any = {};
          if (q) filters.search = q;
          const result = await getAllProductsPaginated(1, 50, filters);
          items = result.items;
        }

        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [q, activeFilters]);

  const handleApplyFilters = (filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setActiveFilters(filters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer} color="background">
        <View style={styles.searchWrapper}>
          <SearchBar
            onSearch={(query) => router.push(`/search?q=${query}` as any)}
            containerStyle={styles.searchBarCustom}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {loading ? (
          <View style={[styles.section, styles.centered]} color="background">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.section} color="background">
            <Text type="subtitle" style={styles.sectionTitle}>
              {q ? `Resultados para "${q}"` : "Todos os produtos"}
            </Text>
            <Text color="textSecondary" style={styles.count}>
              {products.length} produtos encontrados
            </Text>

            <View style={styles.productsGrid} color="background">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={handleProductPress}
                />
              ))}
            </View>

            {products.length === 0 && (
              <View style={styles.empty} color="background">
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text type="subtitle">Nenhum produto encontrado</Text>
                <Text color="textSecondary">
                  Tente buscar com outras palavras-chave ou ajustar os filtros
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        categories={categories}
        initialFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
  },
  searchBarCustom: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scrollContent: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  /* debugFilterButton removed */
  centered: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  count: {
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
});
