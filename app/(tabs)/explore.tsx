import { ScrollView, Text, View } from "@/components/Themed";
import { ProductCard, SearchBar } from "@/components/marketplace";
import { Product, Category } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { getAllProductsPaginated } from "@/services/products";
import { useTheme } from "@/context/ThemeContext";
import {
  BooksIcon,
  FootballIcon,
  HomeIcon,
  IPhoneIcon,
  LipstickIcon,
  ShirtIcon,
} from "@/components/icons";

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    { id: "1", name: "Eletrônicos", icon: "iphone", productCount: 0 },
    { id: "2", name: "Moda", icon: "shirt", productCount: 0 },
    { id: "3", name: "Casa", icon: "home", productCount: 0 },
    { id: "4", name: "Esportes", icon: "football", productCount: 0 },
    { id: "5", name: "Livros", icon: "books", productCount: 0 },
    { id: "6", name: "Beleza", icon: "lipstick", productCount: 0 },
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { items } = await getAllProductsPaginated(1, 100);
        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SearchBar onSearch={(q) => router.push(`/search?q=${q}`)} />

      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Explorar por Categoria
        </Text>
        {categories.map((category) => {
          const categoryProducts = products.filter(
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
        })}
      </View>
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
});
