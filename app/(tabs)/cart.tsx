import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { CartItem } from "@/components/marketplace/CartItem";
import { ScrollView, Text, View } from "@/components/Themed";
import { Button } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { 
  getCart, 
  removeItemFromCart, 
  updateQuantityInCart,
  checkoutCart 
} from "@/services/cart";

export default function CartScreen() {
  const { colors } = useTheme();
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const handleRemoveItem = (productId: number) => {
    if (!cartData) return;
    
    // Remove item locally
    const updatedItems = Array.isArray(cartData) 
      ? cartData.filter(item => item.product?.id !== productId)
      : cartData.items?.filter((item: any) => item.product?.id !== productId) || [];
    
    // Update state
    setCartData(updatedItems);

    // Remove item on server
    removeItemFromCart(productId).catch(error => {
      console.error("Failed to remove item from cart:", error);

    });
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (!cartData) return;

    // Update quantity locally
    const updatedItems = cartData.map((item: any) => {
      if (item.product?.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Update state
    setCartData(updatedItems);

    // Update quantity on server
    updateQuantityInCart(productId, newQuantity).catch(error => {
      console.error("Failed to update item quantity:", error);
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await checkoutCart();
      setCartData(null); // Clear cart on successful checkout
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  async function fetchCart() {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      setCartData(null);
      setLoading(false);
      return;
    }

    setToken(token);
    try {
      const cartData = await getCart();
      setCartData(cartData);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchCart();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchOnFocus() {
        const testToken = await AsyncStorage.getItem("authToken");
        if (token !== testToken) {
          setLoading(true);
          await fetchCart();
        }
      }

      if (!token) {
        return
      }

      fetchOnFocus();
      }, [token, cartData])
  )

  if (loading) {
      return (
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
  }

  function emptyCart() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.emptyState} color="background">
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text type="subtitle" style={styles.emptyTitle}>
            Seu carrinho está vazio
          </Text>
          <Text color="textSecondary" style={styles.emptyDescription}>
            Adicione produtos ao carrinho para vê-los aqui
          </Text>
          <Button title="Explorar Produtos" style={styles.button} />
        </View>
      </ScrollView>
    );
  }

  function filledCart() {
    const items = cartData
    
    const total = items.reduce((sum: number, item: any) => {
      return sum + ((item.product?.price || 0) * (item.quantity || 0));
    }, 0);

    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
        data={items}
        keyExtractor={(item, index) => item.product?.id?.toString() || index.toString()}
        ListHeaderComponent={() => (
          <Text type="title" style={styles.headerTitle}>
            Meu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </Text>
        )}
        renderItem={({ item }) => (
          <CartItem 
            item={item} 
            onRemove={() => handleRemoveItem(item.product?.id)}
            onQuantityChange={(newQuantity) => handleQuantityChange(item.product?.id, newQuantity)}
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.footer} color="background">
            <View style={styles.totalContainer} color="background">
              <Text type="subtitle" style={styles.totalLabel}>Total:</Text>
              <Text type="title" style={[styles.totalValue, { color: colors.price }]}>
                R$ {total.toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <Button 
              title="Finalizar Compra" 
              style={styles.checkoutButton}
              onPress={() => handleCheckout()}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text color="textSecondary" style={styles.emptyMessage}>
            Nenhum item no carrinho
          </Text>
        )}
      />
    );
  }

  return (
    <View style={styles.container} color="background">
      {loading ? 
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View> 
        :
       (!cartData || Object.keys(cartData).length === 0 ? emptyCart() : filledCart())}
    </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    maxWidth: 300,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
  headerTitle: {
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 24,
  },
  checkoutButton: {
    width: "100%",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
