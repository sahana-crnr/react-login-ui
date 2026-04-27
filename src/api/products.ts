import { requestJson } from "./client";
import { Product } from "../types/shop";

type ProductApiResponse = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  original_price: string | number | null;
  rating: string | number;
  ratings_count: number;
  reviews_count: number;
  image: string;
  color?: string | null;
  size?: string | null;
  category?: string | null;
  stock?: number;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

const normalizeProduct = (product: ProductApiResponse): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  originalPrice:
    product.original_price == null ? undefined : Number(product.original_price),
  rating: Number(product.rating),
  ratingsCount: product.ratings_count,
  reviewsCount: product.reviews_count,
  image: product.image,
  color: product.color ?? undefined,
  size: product.size ?? undefined,
});

export async function fetchProducts(): Promise<Product[]> {
  const products = await requestJson<ProductApiResponse[]>("/api/products/");
  return products.map(normalizeProduct);
}

export async function fetchProductById(
  id: number | string,
): Promise<Product> {
  const product = await requestJson<ProductApiResponse>(`/api/products/${id}/`);
  return normalizeProduct(product);
}
