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

/**
 * Fetch paginated products list.
 * @param page - page number (1-based)
 * @param limit - items per page
 * @param filters - optional filters: categoryId, minPrice, maxPrice, search
 * @returns { items: Product[], meta: { page, limit, totalItems?, totalPages? } }
 */
export async function getAllProductsPaginated(
  page = 1,
  limit = 10,
  filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }
) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const params: any = { page, limit };
    if (filters) {
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (typeof filters.minPrice === "number")
        params.minPrice = String(filters.minPrice);
      if (typeof filters.maxPrice === "number")
        params.maxPrice = String(filters.maxPrice);
      if (filters.search) params.search = filters.search;
    }

    const response = await axios.get(`${BASE_URL}/products`, {
      headers,
      params,
    });

    const apiProducts = response.data?.products || [];

    // try extract pagination metadata from body or headers
    const metaFromBody = response.data?.meta;
    const totalItemsFromHeader =
      response.headers?.["x-total-count"] ||
      response.headers?.["X-Total-Count"];

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

    const meta: any = {
      page,
      limit,
    };

    if (metaFromBody) {
      meta.totalItems =
        metaFromBody.totalItems || metaFromBody.total || undefined;
      meta.totalPages = metaFromBody.totalPages || undefined;
      meta.page = metaFromBody.page || page;
      meta.limit = metaFromBody.limit || limit;
    } else if (totalItemsFromHeader) {
      const total = parseInt(String(totalItemsFromHeader), 10);
      if (!Number.isNaN(total)) {
        meta.totalItems = total;
        meta.totalPages = Math.ceil(total / limit);
      }
    } else {
      // fallback: if received less than limit, it's last page
      if (normalized.length < limit) {
        meta.totalPages = page;
      }
    }

    return { items: normalized, meta };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "getAllProductsPaginated error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
}

/**
 * Fetch products filtered by category.
 * @param category - category name (e.g., "jewelery")
 * @returns Array of normalized products
 */
export async function getProductsByCategory(category: string) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const response = await axios.get(`${BASE_URL}/products`, {
      headers,
      params: { category },
    });

    const apiProducts = response.data?.products || [];

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
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
    }
    console.error(
      "getProductsByCategory error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch products by category"
    );
  }
}

/**
 * Fetch products filtered by price range.
 * @param {number} [min] - Minimum price value.
 * @param {number} [max] - Maximum price value.
 * @param {number} [page] - Page number for pagination.
 * @param {number} [limit] - Number of items per page.
 * @returns {Promise<{ products: Product[], pagination: Pagination }>} - Normalized products and pagination metadata.
 */
export async function getProductsByPrice(
  min?: number,
  max?: number,
  page?: number,
  limit?: number
) {
  try {
    const token = await AsyncStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const params: Record<string, any> = {};
    if (min !== undefined) params.initialValue = min;
    if (max !== undefined) params.finalValue = max;
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    const response = await axios.get(`${BASE_URL}/products`, {
      headers,
      params,
    });

    const normalizedProducts = response.data.products.map((p: any) => ({
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

    return {
      products: normalizedProducts,
      pagination: {
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || normalizedProducts.length,
      },
    };
  } catch (error) {
    console.error("Error fetching products by price:", error);
    throw error;
  }
}
