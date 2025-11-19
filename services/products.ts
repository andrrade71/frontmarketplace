import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

/**
 * Fetch products posted by a specific user.
 * @param userId - ID of the user whose products will be fetched
 * @returns Array of products in the app's `Product` shape
 */
export async function getProductsByUserId(userId: string) {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;

    const response = await axios.get(`${BASE_URL}/users/${userId}/products`, {
      headers,
    });

    const apiProducts = response.data?.products || [];

    // Normalize API product to app Product shape
    const normalized = apiProducts.map((p: any) => ({
      id: String(p.id),
      name: p.title || p.name || "",
      description: p.description || "",
      price: typeof p.price === "string" ? parseFloat(p.price) : p.price || 0,
      originalPrice: undefined,
      discount: undefined,
      image: p.image || (p.images && p.images[0]) || "",
      images: p.images ? p.images : p.image ? [p.image] : [],
      categoryId: p.categories?.id
        ? String(p.categories.id)
        : p.categoryId || "",
      rating: p.rating?.rate || 0,
      reviewsCount: p.rating?.count || 0,
      inStock: true,
    }));

    return normalized;
  } catch (error: any) {
    // If unauthorized, remove token so app can redirect to login on next action
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "getProductsByUserId error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch user products"
    );
  }
}
