export interface Product {
  id: number;
  name: string;
  size?: string;
  color?: string;
  description?: string;
  price: number;
  image?: string;
  originalPrice?: number;
  rating?: number;
  ratingsCount?: number;
  reviewsCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  email: string;
  password: string;
  cart?: CartItem[];
  wishlist?: Product[];
}

export type AuthActionResult = {
  success: boolean;
  message: string;
  field?: "email" | "password" | string;
  user?: UserProfile;
};
