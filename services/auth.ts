import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

/**
 * Logs in the user with the provided email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The user data and token if successful.
 */
export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data.data;

    // Store the token in AsyncStorage
    await AsyncStorage.setItem("authToken", token);

    return { user, token };
  } catch (error: any) {
    const status = error.response?.status;
    const serverData = error.response?.data;
    const serverMessage = serverData?.message || error.message;
    const serverCode = serverData?.code;
    console.error("Login failed:", serverData || error.message);

    // Structured auth error so UI can handle different cases (401, 404, etc.)
    class AuthError extends Error {
      status?: number;
      code?: string;
      raw?: any;
      constructor(message: string, status?: number, code?: string, raw?: any) {
        super(message);
        this.name = "AuthError";
        this.status = status;
        this.code = code;
        this.raw = raw;
      }
    }

    throw new AuthError(
      serverMessage || "Failed to login",
      status,
      serverCode,
      serverData
    );
  }
}

/**
 * Fetches the authenticated user's profile data.
 * @returns The user data if successful.
 */
export async function getUserProfile() {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch user profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
}
