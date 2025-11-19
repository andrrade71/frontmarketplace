import { ScrollView, Text, View } from "@/components/Themed";
import { ProductCard, SearchBar } from "@/components/marketplace";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function SearchScreen() {
  const { q, category } = useLocalSearchParams<{
    q?: string;
    category?: string;
  }>();
  const router = useRouter();

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  const filteredProducts = mockProducts.filter((product) => {
    if (category) {
      return product.categoryId === category;
    }
    if (q) {
      const query = q.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <ScrollView style={styles.container}>
      <SearchBar
        onSearch={(query) => router.push(`/search?q=${query}` as any)}
      />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
