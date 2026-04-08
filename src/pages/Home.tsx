import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { QueryFunctionContext, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import products from "../data/products.json";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaSort, FaFilter } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ProductCard from "../components/ProductCard";
import useSearchStore from "../store/useSearchStore";
import { Product } from "../types/shop";
import { toIconComponent } from "../utils/icons";

const PRODUCTS_PER_PAGE = 8;

const SortIcon = toIconComponent(FaSort);
const FilterIcon = toIconComponent(FaFilter);

type ProductFilters = {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  minReviews: string;
  sortBy: string;
};

type ProductsPage = {
  page: number;
  products: Product[];
  totalCount: number;
  hasMore: boolean;
};

type ProductsQueryKey = ["products", ProductFilters];

const useDelayedBoolean = (value: boolean, delay = 500): boolean => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (value) {
      timerRef.current = window.setTimeout(() => setVisible(true), delay);
    } else {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  return visible;
};

const fetchProductsPage = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<ProductsQueryKey>): Promise<ProductsPage> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const [, filters] = queryKey;
  const safeProducts = Array.isArray(products) ? (products as Product[]) : [];
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

  const filtered = safeProducts.filter((product) => {
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
      minReviewsValue === null || (product.reviewsCount ?? 0) >= minReviewsValue;

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

const Home = () => {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");

  const { ref, inView } = useInView();

  const queryFilters = useMemo<ProductFilters>(
    () => ({
      searchTerm,
      minPrice,
      maxPrice,
      minRating,
      minReviews,
      sortBy,
    }),
    [searchTerm, minPrice, maxPrice, minRating, minReviews, sortBy],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ProductsPage, Error, InfiniteData<ProductsPage>, ProductsQueryKey>({
      queryKey: ["products", queryFilters],
      queryFn: fetchProductsPage,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    });

  const productPages = data?.pages ?? [];
  const displayProducts = productPages.flatMap((page) => page.products);
  const totalFilteredCount = productPages[0]?.totalCount ?? 0;
  const isInitialLoading = isLoading && displayProducts.length === 0;
  const showInitialLoadingText = useDelayedBoolean(isInitialLoading);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinPrice(value === "" ? "" : String(Math.max(0, Number(value))));
  };

  const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxPrice(value === "" ? "" : String(Math.max(0, Number(value))));
  };

  const handleMinReviewsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinReviews(value === "" ? "" : String(Math.max(0, Number(value))));
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8 max-w-8xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8 relative">
          <h1 className="text-2xl md:text-2xl font-bold text-foreground">
            Product Collection
          </h1>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block text-muted-foreground font-medium">
              {totalFilteredCount} Items
            </p>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
                className={`bg-card border text-foreground px-4 py-2 rounded-2xl flex items-center gap-2 hover:border-purple-600 hover:bg-muted/80 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${isSortOpen
                    ? "border-purple-600 ring-2 ring-purple-500/20"
                    : "border-border"
                  }`}
              >
                <SortIcon /> Sort By
              </button>
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-3 w-52 bg-card p-3 rounded-2xl shadow-xl border border-border z-40 flex flex-col gap-1 text-sm font-medium">
                  <button
                    onClick={() => {
                      setSortBy("default");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "default"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-asc");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "price-asc"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("price-desc");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "price-desc"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("rating-desc");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "rating-desc"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Rating: High to Low
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("name-asc");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "name-asc"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Name: A to Z
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("name-desc");
                      setIsSortOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-xl transition-colors ${sortBy === "name-desc"
                        ? "bg-purple-100 dark:bg-purple-900/40 font-bold text-purple-700 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    Name: Z to A
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsSortOpen(false);
                }}
                className={`bg-card border text-foreground px-4 py-2 rounded-2xl flex items-center gap-2 hover:border-purple-600 hover:bg-muted/80 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium ${isFilterOpen
                    ? "border-purple-600 ring-2 ring-purple-500/20"
                    : "border-border"
                  }`}
              >
                <FilterIcon /> Filters
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-3 w-full max-w-sm sm:w-80 bg-card p-6 rounded-2xl shadow-xl border border-border z-40">
                  <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
                    Filters
                  </h2>

                  <div className="mb-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">
                      Price Range (₹)
                    </h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="h-9 text-sm bg-background border-border text-foreground"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="h-9 text-sm bg-background border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">
                      Minimum Rating
                    </h3>
                    <select
                      value={minRating}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        setMinRating(Number(event.target.value))
                      }
                      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={4}>4 Stars & Up</option>
                      <option value={3}>3 Stars & Up</option>
                      <option value={2}>2 Stars & Up</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">
                      Minimum Reviews
                    </h3>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={minReviews}
                      onChange={handleMinReviewsChange}
                      className="h-9 text-sm bg-background border-border text-foreground"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setMinRating(0);
                      setMinReviews("");
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isInitialLoading && showInitialLoadingText ? (
          <div className="text-center text-muted-foreground text-lg py-20">
            Loading products...
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg py-20 bg-card rounded-2xl shadow-sm border border-border">
            No products found matching your criteria.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div ref={ref} />
            {isFetchingNextPage && (
              <div className="text-center text-purple-600 text-lg py-10">
                Loading more...
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
