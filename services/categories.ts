import { Category } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

/**
 * Fetch all categories from the API.
 * @returns Array of normalized categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response = await axios.get(`${BASE_URL}/categories`, {
      headers,
    });

    const apiCategories = response.data?.categories || [];

    const normalized: Category[] = apiCategories.map((c: any) => ({
      id: String(c.id),
      name: c.name || "",
      icon: "",
      productCount: 0, // Backend doesn't provide count
    }));

    return normalized;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "getCategories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
}
