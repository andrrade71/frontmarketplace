import { ScrollView, Text, View } from "@/components/Themed";
import { FilterModal, ProductCard, SearchBar } from "@/components/marketplace";
import { useTheme } from "@/context/ThemeContext";
import { getCategories } from "@/services/categories";
import { getAllProductsPaginated } from "@/services/products";
import { Category, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAllProductsPaginated(1, 100),
          getCategories(),
        ]);
        setProducts(productsData.items);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleApplyFilters = (filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setActiveFilters(filters);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        activeFilters.categoryId &&
        p.categoryId !== activeFilters.categoryId
      ) {
        return false;
      }
      if (
        typeof activeFilters.minPrice === "number" &&
        typeof p.price === "number" &&
        p.price < activeFilters.minPrice
      ) {
        return false;
      }
      if (
        typeof activeFilters.maxPrice === "number" &&
        typeof p.price === "number" &&
        p.price > activeFilters.maxPrice
      ) {
        return false;
      }
      return true;
    });
  }, [products, activeFilters]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer} color="background">
          <SearchBar onSearch={(q) => router.push(`/search?q=${q}`)} />

          <View style={styles.filterBar} color="background">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !activeFilters.categoryId && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilters({})}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !activeFilters.categoryId && styles.filterChipTextActive,
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.filterChip,
                    activeFilters.categoryId === cat.id &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilters({ categoryId: cat.id })}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilters.categoryId === cat.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {cat.icon} {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.priceFilterButton}
              onPress={() => setIsFilterModalVisible(true)}
            >
              <Ionicons name="pricetag-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section} color="background">
          <Text type="subtitle" style={styles.sectionTitle}>
            {activeFilters.categoryId
              ? `Categoria: ${
                  categories.find((c) => c.id === activeFilters.categoryId)
                    ?.name
                }`
              : "Explorar por Categoria"}
          </Text>

          {/* Empty state when filters applied but no products match */}
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyFilters}>
              <Text type="subtitle">Nenhum produto encontrado</Text>
              <Text color="textSecondary" style={styles.emptyFiltersHint}>
                Não há produtos que correspondam aos filtros selecionados.
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => setActiveFilters({})}
              >
                <Text style={styles.clearFiltersButtonText}>
                  Limpar filtros
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            categories.map((category) => {
              // Se há filtro ativo, mostrar apenas essa categoria
              if (
                activeFilters.categoryId &&
                activeFilters.categoryId !== category.id
              ) {
                return null;
              }

              const categoryProducts = filteredProducts.filter(
                (p) => p.categoryId === category.id
              );

              if (categoryProducts.length === 0) return null;

              return (
                <View
                  key={category.id}
                  style={styles.categorySection}
                  color="background"
                >
                  <Text type="default" style={styles.categoryTitle}>
                    {category.icon} {category.name}
                  </Text>
                  <View style={styles.productsGrid} color="background">
                    {categoryProducts.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onPress={handleProductPress}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </View>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingBottom: 8,
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterScroll: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#6B7280",
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  priceFilterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  emptyFilters: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyFiltersHint: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  clearFiltersButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
