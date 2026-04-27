import { QueryFunctionContext } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { Product } from "../types/shop";

export const PRODUCTS_PER_PAGE = 8;

export type ProductFilters = {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  minReviews: string;
  sortBy: string;
};

export type ProductsPage = {
  page: number;
  products: Product[];
  totalCount: number;
  hasMore: boolean;
};

export type ProductsQueryKey = ["products", ProductFilters];

export const fetchProductsPage = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<ProductsQueryKey>): Promise<ProductsPage> => {
  const allProducts = await fetchProducts();

  const [, filters] = queryKey;
  const searchWords = (filters.searchTerm || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
  const minPriceValue =
    filters.minPrice === "" || filters.minPrice == null
      ? null
      : Number(filters.minPrice);
  const maxPriceValue =
    filters.maxPrice === "" || filters.maxPrice == null
      ? null
      : Number(filters.maxPrice);
  const minRatingValue = Number(filters.minRating ?? 0);
  const minReviewsValue =
    filters.minReviews === "" || filters.minReviews == null
      ? null
      : Number(filters.minReviews);
  const sortBy = filters.sortBy || "default";

  const filtered = allProducts.filter((product) => {
    const productNameLower = product.name.toLowerCase();
    const matchesSearch = searchWords.every((word) =>
      productNameLower.includes(word),
    );
    const matchesMinPrice =
      minPriceValue === null || product.price >= minPriceValue;
    const matchesMaxPrice =
      maxPriceValue === null || product.price <= maxPriceValue;
    const matchesRating = (product.rating ?? 4.3) >= minRatingValue;
    const matchesReviews =
      minReviewsValue === null ||
      (product.reviewsCount ?? 0) >= minReviewsValue;

    return (
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating &&
      matchesReviews
    );
  });

  const sorted = [...filtered];
  if (sortBy === "price-asc") {
    sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (sortBy === "rating-desc") {
    sorted.sort((a, b) => (b.rating ?? 4.3) - (a.rating ?? 4.3));
  } else if (sortBy === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-desc") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  const normalizedPageParam =
    typeof pageParam === "number" ? pageParam : Number(pageParam) || 1;
  const start = (normalizedPageParam - 1) * PRODUCTS_PER_PAGE;
  const nextPageItems = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  return {
    page: normalizedPageParam,
    products: nextPageItems,
    totalCount: sorted.length,
    hasMore: start + PRODUCTS_PER_PAGE < sorted.length,
  };
};
