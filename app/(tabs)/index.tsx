import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { View, Text, ScrollView } from '@/components/Themed';
import { SearchBar, ProductCard, CategoryCard } from '@/components/marketplace';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Product, Category } from '@/types';

export default function HomeScreen() {
  const router = useRouter();

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/search?category=${category.id}`);
  };

  const handleSearch = (query: string) => {
    router.push(`/search?q=${query}`);
  };

  const featuredProducts = mockProducts.filter((p) => p.discount && p.discount > 0);

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Categories */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Categorias
        </Text>
        <View style={styles.categoriesGrid} color="background">
          {mockCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Destaques
        </Text>
        <View style={styles.productsGrid} color="background">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>
      </View>

      {/* All Products */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Todos os Produtos
        </Text>
        <View style={styles.productsGrid} color="background">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>
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
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
