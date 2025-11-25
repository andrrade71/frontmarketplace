import { CartItem } from './../types/index';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

/**
 * Adds a product to the cart.
 * @param productId - ID of the product to add
 * @param quantity - Quantity of the product to add
 * @returns Confirmation message or updated cart data
 */

export async function addToCart(
  productId: number,
  quantity: number
): Promise<any> {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await axios.post(
      `${BASE_URL}/cart/add`,
      { productId, quantity },
        { headers }
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "addToCart error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
}

export async function getCart(): Promise<any> {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await axios.get(`${BASE_URL}/cart`, { headers });

    return response.data.cartItems;

  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    } console.error(
        "getCart error:",
        error.response?.data || error.message
      );
    throw new Error(error.response?.data?.message);
  }
}

export async function removeItemFromCart(
  productId: number
): Promise<any> {
    try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await axios.delete(
      `${BASE_URL}/cart/remove/${productId}`,
      { headers }
    );
    return response.data;;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "removeItemFromCart error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message);
  }
}

export async function updateQuantityInCart(
  productId: number,
  quantity: number
): Promise<any> {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await axios.put(
      `${BASE_URL}/cart/update/${productId}/${quantity}`,
      {},
      { headers }
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "updateQuantityInCart error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update cart");
  }
}