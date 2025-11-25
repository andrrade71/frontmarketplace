import { Text, View } from "@/components/Themed";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export type CartItemProps = {
  item: {
    product?: {
      id?: string | number;
      image?: string;
      images?: string[];
      title?: string;
      name?: string;
      price?: number;
    };
    quantity?: number;
  };
  onRemove?: () => void;
  onQuantityChange?: (newQuantity: number) => void;
};

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const { colors } = useTheme();
  
  const productImage = item.product?.image || item.product?.images?.[0] || "";
  const productName = item.product?.title || item.product?.name || "Produto";
  const quantity = item.quantity || 0;
  const price = item.product?.price || 0;
  const totalPrice = price * quantity;

  const handleDecrement = () => {
    if (quantity > 1 && onQuantityChange) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (onQuantityChange) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View style={styles.cartItem} color="background">
      {/*Product Image*/}
      <Image 
        source={{ uri: productImage }}
        style={[styles.productImage, { backgroundColor: colors.backgroundTertiary }]}
      />

      <View style={styles.productInfo} color="background">
        <View style={styles.productHeader} color="background">
          {/*Product Name*/}
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>

          {/*Remove Button*/}
          <TouchableOpacity 
            onPress={onRemove}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="trash-o" size={20} color={"#ff4444"} />
          </TouchableOpacity>

        </View>

        {/*Quantity Selector*/}
        <View style={styles.quantityRow} color="background">

          <Text color="textSecondary" style={styles.quantityLabel}>
            Quantidade:
          </Text>

          <View style={[styles.quantityContainer, { backgroundColor: colors.card }]} color="background">

            {/*Decrement Button*/}
            <TouchableOpacity
              onPress={handleDecrement}
              style={[
                styles.quantityButton,
                { 
                  opacity: quantity <= 1 ? 0.5 : 1,
                  borderColor: quantity <= 1 ? colors.border : colors.primary,
                  backgroundColor: colors.card
                }
              ]}
              disabled={quantity <= 1}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.quantityButtonText, { color: quantity <= 1 ? colors.border : colors.primary }]}>-</Text>
            </TouchableOpacity>
            
            {/*Quantity Text*/}
            <Text color="text" style={styles.quantityText}>{quantity}</Text>

            {/*Increment Button*/}
            <TouchableOpacity
              onPress={handleIncrement}
              style={[styles.quantityButton, { borderColor: colors.primary, backgroundColor: colors.card }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.quantityButtonText, { color: colors.primary }]}>+</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/*Total Price*/}
        <Text style={[styles.productPrice, { color: colors.price }]}>
          R$ {totalPrice.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "center",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
    position: "relative",
    bottom: "1%",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  productQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
