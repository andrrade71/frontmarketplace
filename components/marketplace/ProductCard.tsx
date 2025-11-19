import { Text, View } from "@/components/Themed";
import { Badge } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import { Product } from "@/types";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cards por linha com gap de 16

export type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { colors } = useTheme();

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(product)}
      style={[styles.container, { width: CARD_WIDTH }]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {product.discount && (
            <View style={styles.discountBadge}>
              <Badge
                label={`-${product.discount}%`}
                variant="error"
                size="small"
              />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info} color="card">
          <Text numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.rating} color="card">
            <Text style={[styles.ratingText, { color: colors.rating }]}>★</Text>
            <Text style={styles.ratingValue} color="textSecondary">
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer} color="card">
            {product.originalPrice && (
              <Text
                style={[styles.originalPrice, { color: colors.textTertiary }]}
                numberOfLines={1}
              >
                {formatPrice(product.originalPrice)}
              </Text>
            )}
            <Text style={[styles.price, { color: colors.price }]}>
              {formatPrice(product.price)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    minHeight: 36,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: "column",
    gap: 2,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
