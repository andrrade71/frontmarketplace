import { ScrollView, Text, View } from "@/components/Themed";
import { ProductCard, SearchBar } from "@/components/marketplace";
import { Product } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { getAllProductsPaginated } from "@/services/products";
import { useTheme } from "@/context/ThemeContext";

export default function SearchScreen() {
  const { q, category } = useLocalSearchParams<{
    q?: string;
    category?: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const filters: any = {};
        if (category) filters.categoryId = category;
        if (q) filters.search = q;
        
        const { items } = await getAllProductsPaginated(1, 50, filters);
        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [q, category]);

  const filteredProducts = products;

  return (
    <ScrollView style={styles.container}>
      <SearchBar
        onSearch={(query) => router.push(`/search?q=${query}` as any)}
      />

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
          {filteredProducts.length} produtos encontrados
        </Text>

        <View style={styles.productsGrid} color="background">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.empty} color="background">
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text type="subtitle">Nenhum produto encontrado</Text>
            <Text color="textSecondary">
              Tente buscar com outras palavras-chave
            </Text>
          </View>
        )}
      </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
