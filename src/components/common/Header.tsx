import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { FiMoon, FiShoppingCart, FiSun } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import Sidebar from "./Sidebar";
import useAuthStore from "../../store/useAuthStore";
import useShopStore, { getCartTotalItems } from "../../store/useShopStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CartSheet from "./CartSheet";
import useThemeStore from "../../store/useThemeStore";
import useSearchStore from "../../store/useSearchStore";
import products from "../../data/products.json";
import { Product } from "../../types/shop";
import { toIconComponent } from "../../utils/icons";

const productList = (Array.isArray(products) ? products : []) as Product[];
const SearchIcon = toIconComponent(FaSearch);
const SignOutIcon = toIconComponent(FaSignOutAlt);
const ClearIcon = toIconComponent(FaTimes);
const MoonIcon = toIconComponent(FiMoon);
const ShoppingCartIcon = toIconComponent(FiShoppingCart);
const SunIcon = toIconComponent(FiSun);

export default function Header() {
  const navigate = useNavigate();
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const skipNextSuggestionUpdateRef = useRef(false);
  const [debouncedSearchTerm] = useDebounce(searchInput, 400);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const cartCount = useShopStore(getCartTotalItems);
  const openCart = useShopStore((state) => state.openCart);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    const { currentUser, updateUserData, logoutUser } = useAuthStore.getState();
    const { cart, wishlist } = useShopStore.getState();

    if (currentUser) {
      updateUserData(currentUser.email, cart, wishlist);
    }

    logoutUser();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    if (skipNextSuggestionUpdateRef.current) {
      skipNextSuggestionUpdateRef.current = false;
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debouncedSearchTerm.trim().length > 0) {
      const searchWords = debouncedSearchTerm.toLowerCase().split(" ").filter(Boolean);
      const filteredProducts = productList
        .filter((product) => {
          const productNameLower = product.name.toLowerCase();
          return searchWords.every((word) => productNameLower.includes(word));
        })
        .slice(0, 5);

      setSuggestions(filteredProducts);
      setShowSuggestions(isSearchFocused && filteredProducts.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, isSearchFocused]);

  useEffect(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchFocused(false);
    skipNextSuggestionUpdateRef.current = false;
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (productId: number) => {
    skipNextSuggestionUpdateRef.current = true;
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="bg-background border-b border-border shadow-sm py-4 px-4 md:px-6 sticky top-0 z-50 w-full transition-colors">
      <CartSheet />
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Sidebar />
          <div className="text-3xl font-extrabold text-purple-700 tracking-wide shrink-0">
            ShopZone
          </div>
        </div>

        <div ref={searchContainerRef} className="relative w-full md:max-w-md lg:max-w-lg flex-1 rounded-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
            <SearchIcon />
          </span>
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) => {
              skipNextSuggestionUpdateRef.current = false;
              setSearchInput(event.target.value);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              if (searchInput && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              setIsSearchFocused(false);
              setShowSuggestions(false);
            }}
            autoComplete="off"
            className="pl-11 pr-10"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                skipNextSuggestionUpdateRef.current = false;
                setSearchInput("");
                setSearchTerm("");
                setSuggestions([]);
                setShowSuggestions(false);
                setIsSearchFocused(false);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition focus:outline-none"
              title="Clear search"
            >
              <ClearIcon />
            </button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
              <ul className="divide-y divide-border">
                {suggestions.map((product) => (
                  <li
                    key={product.id}
                    className="p-3 flex items-center gap-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSuggestionClick(product.id);
                    }}
                  >
                    <img
                      src={
                        product.image?.startsWith("/")
                          ? process.env.PUBLIC_URL + product.image
                          : product.image
                      }
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded-md bg-muted/30 p-1"
                    />
                    <span className="font-medium text-sm">
                      {product.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0 w-full md:w-auto overflow-x-auto">
          <nav className="flex gap-4 md:gap-6 text-muted-foreground font-medium whitespace-nowrap">
            <Link to="/home" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-purple-600 transition-colors">
              About Us
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={isDark}
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full border border-border bg-card text-muted-foreground flex items-center justify-center transition hover:border-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isDark ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            </button>

            <div className="flex gap-1">
              <Button
                onClick={openCart}
                title="Cart"
                size="icon"
                className="relative rounded-full bg-purple-600 hover:bg-purple-800"
              >
                <ShoppingCartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-extrabold min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                title="Logout"
                size="icon"
                className="rounded-full bg-purple-600 hover:bg-purple-800"
              >
                <SignOutIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
