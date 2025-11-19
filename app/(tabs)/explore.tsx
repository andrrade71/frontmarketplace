import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, ScrollView } from '@/components/Themed';
import { SearchBar, ProductCard } from '@/components/marketplace';
import { mockProducts, mockCategories } from '@/data/mockData';
import { useRouter } from 'expo-router';
import { Product } from '@/types';

export default function ExploreScreen() {
  const router = useRouter();

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <ScrollView style={styles.container}>
      <SearchBar onSearch={(q) => router.push(`/search?q=${q}`)} />

      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Explorar por Categoria
        </Text>
        {mockCategories.map((category) => (
          <View key={category.id} style={styles.categorySection} color="background">
            <Text type="default" style={styles.categoryTitle}>
              {category.icon} {category.name}
            </Text>
            <View style={styles.productsGrid} color="background">
              {mockProducts
                .filter((p) => p.categoryId === category.id)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={handleProductPress}
                  />
                ))}
            </View>
          </View>
        ))}
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
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
