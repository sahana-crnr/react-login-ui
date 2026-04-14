import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { QueryFunctionContext, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import products from "../data/products.json";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaSort, FaFilter } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useDebounce } from "use-debounce";
import ProductCard from "../components/ProductCard";
import useSearchStore from "../store/useSearchStore";
import { Product } from "../types/shop";
import { toIconComponent } from "../utils/icons";
import { Preloader } from "../components/ui/preloader";

const PRODUCTS_PER_PAGE = 8;
const productCatalog = (Array.isArray(products) ? products : []) as Product[];

const SortIcon = toIconComponent(FaSort);
const FilterIcon = toIconComponent(FaFilter);

const toolbarButtonClass =
  "group inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-purple-400 hover:bg-slate-100 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-background dark:hover:bg-white/5";

const toolbarButtonActiveClass =
  "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20 dark:bg-purple-500/10";

const menuPanelClass =
  "absolute top-full left-1/2 mt-3 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 origin-top-right rounded-2xl border border-border bg-card p-3 shadow-[0_24px_70px_rgba(15,23,42,0.16)] z-50 flex flex-col gap-1 text-sm font-medium animate-dropdown-in sm:left-auto sm:right-0 sm:w-52 sm:max-w-none sm:translate-x-0";

const menuItemBaseClass =
  "text-left px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/5";

const menuItemActiveClass =
  "bg-purple-100 font-semibold text-purple-700 shadow-sm dark:bg-purple-500/10 dark:text-purple-300";

const filterPanelClass =
  "absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] origin-top-right rounded-[1.75rem] border border-border/80 bg-card/95 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.16)] z-50 animate-dropdown-in backdrop-blur-xl sm:w-80 sm:max-w-sm sm:p-6";

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

type AnimatedResultCardProps = {
  product: Product;
  index: number;
};

const AnimatedResultCard: React.FC<AnimatedResultCardProps> = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={`h-full transform transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      style={{ transitionDelay: `${index * 45}ms` }}
    >
      <ProductCard product={product} />
    </div>
  );
};

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
  const safeProducts = productCatalog;
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
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
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
      searchTerm: debouncedSearchTerm,
      minPrice,
      maxPrice,
      minRating,
      minReviews,
      sortBy,
    }),
    [debouncedSearchTerm, minPrice, maxPrice, minRating, minReviews, sortBy],
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
  const animationSeed = useMemo(
    () =>
      [
        debouncedSearchTerm,
        minPrice,
        maxPrice,
        minRating,
        minReviews,
        sortBy,
      ].join("|"),
    [debouncedSearchTerm, minPrice, maxPrice, minRating, minReviews, sortBy],
  );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Product collection
            </h1>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:gap-4 lg:w-auto">
            <p className="hidden sm:block font-medium text-muted-foreground">
              {totalFilteredCount} Items
            </p>

            <div className="relative" ref={sortRef}>
              <button
                type="button"
                aria-expanded={isSortOpen}
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
                className={`${toolbarButtonClass} ${isSortOpen ? toolbarButtonActiveClass : ""}`}
              >
                <SortIcon className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                <span>Sort By</span>
              </button>
              {isSortOpen && (
                <div className={menuPanelClass}>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("default");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "default" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("price-asc");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "price-asc" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("price-desc");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "price-desc" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("rating-desc");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "rating-desc" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Rating: High to Low
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("name-asc");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "name-asc" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Name: A to Z
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("name-desc");
                      setIsSortOpen(false);
                    }}
                    className={`${menuItemBaseClass} ${sortBy === "name-desc" ? menuItemActiveClass : "text-muted-foreground"}`}
                  >
                    Name: Z to A
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={filterRef}>
              <button
                type="button"
                aria-expanded={isFilterOpen}
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsSortOpen(false);
                }}
                className={`${toolbarButtonClass} ${isFilterOpen ? toolbarButtonActiveClass : ""}`}
              >
                <FilterIcon className={`transition-transform duration-300 ${isFilterOpen ? "rotate-12 scale-110" : ""}`} />
                <span>Filters</span>
              </button>

              {isFilterOpen && (
                <div className={filterPanelClass}>
                  <h2 className="mb-4 border-b border-border pb-2 text-lg font-bold text-foreground">
                    Filters
                  </h2>

                  <div className="mb-5">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                      Price Range (₹)
                    </h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="h-9 border-border bg-background text-sm text-foreground shadow-sm"
                      />
                      <span className="text-foreground/70">-</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="h-9 border-border bg-background text-sm text-foreground shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                      Minimum Rating
                    </h3>
                    <select
                      value={minRating}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        setMinRating(Number(event.target.value))
                      }
                      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={4}>4 Stars & Up</option>
                      <option value={3}>3 Stars & Up</option>
                      <option value={2}>2 Stars & Up</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                      Minimum Reviews
                    </h3>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 100"
                      value={minReviews}
                      onChange={handleMinReviewsChange}
                      className="h-9 border-border bg-background text-sm text-foreground shadow-sm"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setMinRating(0);
                      setMinReviews("");
                    }}
                    className="w-full bg-purple-600 text-sm text-white hover:bg-purple-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isInitialLoading && showInitialLoadingText ? (
          <Preloader />
        ) : displayProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card/80 px-6 py-20 text-center text-lg text-muted-foreground shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            No products found matching your criteria.
          </div>
        ) : (
          <>
            <div
              key={animationSeed}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:gap-6"
            >
              {displayProducts.map((product, index) => (
                <AnimatedResultCard
                  key={`${animationSeed}-${product.id}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
            <div ref={ref} />
            {isFetchingNextPage && (
              <Preloader compact title="Loading more..." />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
