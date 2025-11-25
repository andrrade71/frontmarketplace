import { ComponentType } from "react";
import { SvgProps } from "react-native-svg";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  categoryId: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  IconComponent?: ComponentType<SvgProps>;
  image?: string;
  productCount: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
};

export type Address = {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  address: Address;
};
