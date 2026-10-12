// types/api.ts

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartSummary {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}