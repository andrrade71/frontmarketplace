import { Text, View } from "@/components/Themed";
import { Badge, Button } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { getProductById, ProductDetail } from "@/services/product";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(String(id));
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar produto");
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text type="title">Produto não encontrado</Text>
        {error && <Text color="textSecondary">{error}</Text>}
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Product Info */}
      <View style={styles.content} color="background">
        {product.discount && (
          <View style={styles.badgeContainer} color="background">
            <Badge label={`${product.discount}% OFF`} variant="error" />
          </View>
        )}

        <Text type="title" style={styles.name}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.rating} color="background">
          <Text style={[styles.ratingText, { color: colors.rating }]}>★</Text>
          <Text color="textSecondary">
            {product.rating.toFixed(1)} ({product.reviewsCount} avaliações)
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer} color="background">
          {product.originalPrice && (
            <Text
              style={[styles.originalPrice, { color: colors.textTertiary }]}
            >
              De: {formatPrice(product.originalPrice)}
            </Text>
          )}
          <Text style={[styles.price, { color: colors.price }]}>
            {formatPrice(product.price)}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section} color="background">
          <Text type="subtitle" style={styles.sectionTitle}>
            Descrição
          </Text>
          <Text color="textSecondary">{product.description}</Text>
        </View>

        {/* Stock Status */}
        <View style={styles.section} color="background">
          <Badge
            label={product.inStock ? "Em estoque" : "Indisponível"}
            variant={product.inStock ? "success" : "error"}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions} color="background">
          <Button
            title="Adicionar ao Carrinho"
            disabled={!product.inStock}
            style={{ flex: 1 }}
          />
          <Button
            title="Comprar Agora"
            variant="secondary"
            disabled={!product.inStock}
            style={{ flex: 1 }}
          />
        </View>
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
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  name: {
    marginBottom: 12,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 20,
  },
  priceContainer: {
    marginBottom: 24,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
