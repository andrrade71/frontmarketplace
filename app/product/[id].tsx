import { Text, View } from "@/components/Themed";
import { Badge, Button } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import { addToCart } from "@/services/cart";
import {
  getProductById,
  getProductReviews,
  ProductDetail,
  Review,
} from "@/services/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(String(id));
        setProduct(data);

        // Fetch reviews
        setLoadingReviews(true);
        try {
          const reviewsData = await getProductReviews(String(id));
          setReviews(reviewsData);
        } catch (reviewErr) {
          console.error("Failed to load reviews:", reviewErr);
          setReviews([]);
        } finally {
          setLoadingReviews(false);
        }
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

        {/* Reviews */}
        <View style={styles.section} color="background">
          <Text type="subtitle" style={styles.sectionTitle}>
            Avaliações ({reviews.length})
          </Text>

          {loadingReviews ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <View
                key={review.id}
                style={styles.reviewCard}
                color="background"
              >
                <View style={styles.reviewHeader} color="background">
                  <View style={styles.reviewUser} color="background">
                    <Text style={styles.reviewUsername}>
                      {review.user.username}
                    </Text>
                    <Text color="textSecondary" style={styles.reviewDate}>
                      {review.createdAt.toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <View style={styles.reviewRating} color="background">
                    <Text style={[styles.ratingText, { color: colors.rating }]}>
                      ★
                    </Text>
                    <Text style={styles.reviewRatingText}>
                      {review.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text color="textSecondary" style={styles.reviewComment}>
                  {review.comment}
                </Text>
              </View>
            ))
          ) : (
            <Text color="textSecondary">Nenhuma avaliação ainda</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions} color="background">
          <Button
            title="Adicionar ao Carrinho"
            loading={cartLoading}
            disabled={!product.inStock || cartLoading}
            style={{ flex: 1 }}
            onPress={async () => {
              const token = await AsyncStorage.getItem("authToken");

              if (!token) {
                router.push("/profile");
                return;
              }

              setCartLoading(true);
              try {
                await addToCart(parseInt(product.id), 1);
                router.push("/cart");
              } catch (err: any) {
                console.error("Failed to add to cart:", err);
                alert(`Erro: ${err.message || 'Não foi possível adicionar ao carrinho'}`);
              } finally {
                setCartLoading(false);
              }
            }}
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
  reviewCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewUser: {
    flex: 1,
  },
  reviewUsername: {
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewRatingText: {
    fontWeight: "600",
  },
  reviewComment: {
    lineHeight: 20,
  },
});
