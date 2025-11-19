import { Text, View } from "@/components/Themed";
import { CategoryCard, ProductCard, SearchBar } from "@/components/marketplace";
import { getCategories } from "@/services/categories";
import { getAllProductsPaginated } from "@/services/products";
import { Category, Product } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/search?category=${category.id}`);
  };

  // Fetch categories from API
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesQuery.data || [];

  const onSearch = (query: string) => {
    router.push(`/search?q=${query}`);
  };

  // Load first page to populate featured products (e.g. top-rated)
  const firstPage = useQuery({
    queryKey: ["products", "firstPage"],
    queryFn: () => getAllProductsPaginated(1, 12),
  });

  const featuredProducts = useMemo(() => {
    const items: Product[] = firstPage.data?.items || [];
    return items.filter((p) => (p.rating ?? 0) >= 4).slice(0, 4);
  }, [firstPage.data]);

  return (
    <ProductsList
      onPressItem={handleProductPress}
      featuredProducts={featuredProducts}
      onSearch={onSearch}
      onCategoryPress={handleCategoryPress}
      categories={categories}
    />
  );
}

function ProductsList({
  onPressItem,
  featuredProducts,
  onSearch,
  onCategoryPress,
  categories,
}: {
  onPressItem: (p: Product) => void;
  featuredProducts: Product[];
  onSearch: (query: string) => void;
  onCategoryPress: (category: Category) => void;
  categories: Category[];
}) {
  const PAGE_LIMIT = 10;

  const fetchProducts = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) =>
      getAllProductsPaginated(pageParam, PAGE_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage.meta as any;
      if (meta?.totalPages) {
        return meta.page < meta.totalPages ? meta.page + 1 : undefined;
      }
      // fallback: if items length === limit, assume next page exists
      return lastPage.items.length === PAGE_LIMIT
        ? (meta.page || 1) + 1
        : undefined;
    },
  });

  const products = useMemo(() => {
    if (!fetchProducts.data) return [] as Product[];
    return fetchProducts.data.pages.flatMap((p) => p.items) as Product[];
  }, [fetchProducts.data]);

  const loadMore = useCallback(() => {
    if (fetchProducts.hasNextPage && !fetchProducts.isFetchingNextPage) {
      fetchProducts.fetchNextPage();
    }
  }, [fetchProducts]);

  if (fetchProducts.isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 24 }} />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={onPressItem} />
      )}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
      ListHeaderComponent={() => (
        <View>
          <SearchBar onSearch={onSearch} />
          <View style={styles.section} color="background">
            <Text type="subtitle" style={styles.sectionTitle}>
              Categorias
            </Text>
            <View style={styles.categoriesGrid} color="background">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={onCategoryPress}
                />
              ))}
            </View>
          </View>
          <View style={styles.section} color="background">
            <Text type="subtitle" style={styles.sectionTitle}>
              Destaques
            </Text>
            <View style={styles.productsGrid} color="background">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={onPressItem}
                />
              ))}
            </View>
          </View>
          <View style={styles.section} color="background">
            <Text type="subtitle" style={styles.sectionTitle}>
              Todos os Produtos
            </Text>
          </View>
        </View>
      )}
      ListFooterComponent={() =>
        fetchProducts.isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 12 }} />
        ) : null
      }
    />
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});
