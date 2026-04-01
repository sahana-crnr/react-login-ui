import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuthStore from "../../store/useAuthStore";
import useShopStore, { getCartTotalItems } from "../../store/useShopStore";
import { useDebounce } from "use-debounce";
import products from "../../data/products.json";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CartSheet from "./CartSheet";

export default function Header({ searchTerm, setSearchTerm }) {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const searchContainerRef = useRef(null);
    const cartCount = useShopStore(getCartTotalItems);
    const openCart = useShopStore((state) => state.openCart);

    const handleLogout = () => {
        const { currentUser, updateUserData, logoutUser } = useAuthStore.getState();
        const { cart, wishlist } = useShopStore.getState();

        // 1. Save data to the user's permanent profile
        if (currentUser) {
            updateUserData(currentUser.email, cart, wishlist);
        }

        // 2. Clear user session but keep the shop data
        logoutUser();
        navigate("/", { replace: true });
    };

    useEffect(() => {
        if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
            const searchWords = debouncedSearchTerm.toLowerCase().split(' ').filter(Boolean);
            const filteredProducts = products.filter(product => {
                const productNameLower = product.name.toLowerCase();
                return searchWords.every(word => productNameLower.includes(word));
            }).slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredProducts);
            setShowSuggestions(filteredProducts.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedSearchTerm]);

    // Handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSuggestionClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowSuggestions(false);
    };

    return (
        <header className="bg-white shadow-md py-4 px-6 md:px-8 sticky top-0 z-50 w-full">
            <CartSheet />
            <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <Sidebar />
                    <div className="text-3xl font-extrabold text-purple-700 tracking-wide shrink-0">
                        ShopZone
                    </div>
                </div>

                {setSearchTerm && (
                    <div ref={searchContainerRef} className="relative w-full md:max-w-md lg:max-w-lg flex-1 rounded-2xl">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            <FaSearch />
                        </span>
                        <label htmlFor="search" className="sr-only">Search products</label>
                        <Input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
                            autoComplete="off"
                            className="pl-11 pr-10"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition focus:outline-none"
                                title="Clear search"
                            >
                                <FaTimes />
                            </button>
                        )}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {suggestions.map(product => (
                                        <li key={product.id}
                                            className="p-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(product.id); }}
                                        >
                                            <img src={product.image?.startsWith('/') ? process.env.PUBLIC_URL + product.image : product.image} alt={product.name} className="w-10 h-10 object-contain rounded-md bg-gray-50 p-1" />
                                            <span className="font-medium text-gray-700 text-sm">{product.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0 w-full md:w-auto overflow-x-auto">
                    <nav className="flex gap-4 md:gap-6 text-gray-600 font-medium whitespace-nowrap">
                        <Link to="/home" className="hover:text-purple-600 transition">Home</Link>
                        <Link to="/about" className="hover:text-purple-600 transition">About Us</Link>
                    </nav>
                    <div className="flex gap-1">
                        <Button onClick={openCart} title="Cart" size="icon" className="relative rounded-full bg-purple-600 hover:bg-purple-800">
                            <FiShoppingCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-extrabold min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                        <Button onClick={handleLogout} title="Logout" size="icon" className="rounded-full bg-purple-600 hover:bg-purple-800">
                            <FaSignOutAlt />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}