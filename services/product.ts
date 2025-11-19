import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

export type ProductDetail = Product & {
  seller?: {
    id: string;
    name: string;
  };
};

/**
 * Fetch a single product by ID.
 * @param id - Product ID
 * @returns Normalized product object with optional seller info
 */
export async function getProductById(id: string): Promise<ProductDetail> {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response = await axios.get(`${BASE_URL}/products/${id}`, {
      headers,
    });

    const p = response.data?.product;

    if (!p) {
      throw new Error("Product not found in response");
    }

    const normalized: ProductDetail = {
      id: String(p.id),
      name: p.title || p.name || "",
      description: p.description || "",
      price: typeof p.price === "string" ? parseFloat(p.price) : p.price || 0,
      originalPrice: p.originalPrice || undefined,
      discount: p.discount || undefined,
      image: p.image || "",
      images: p.images || (p.image ? [p.image] : []),
      categoryId: p.categories?.id ? String(p.categories.id) : "",
      rating: p.rating?.rate || 0,
      reviewsCount: p.rating?.count || 0,
      inStock: typeof p.inStock === "boolean" ? p.inStock : true,
      seller: p.users
        ? {
            id: String(p.users.id),
            name: p.users.username || p.users.name || "",
          }
        : undefined,
    };

    return normalized;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "getProductById error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
}
