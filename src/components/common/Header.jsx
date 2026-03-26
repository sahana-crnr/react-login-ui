import React from "react";
import { FaSearch, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuthStore from "../../store/useAuthStore";
import useShopStore, { getCartTotalItems } from "../../store/useShopStore";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CartSheet from "./CartSheet";

export default function Header({ searchTerm, setSearchTerm }) {
    const navigate = useNavigate();
    const cartCount = useShopStore(getCartTotalItems);
    const openCart = useShopStore((state) => state.openCart);

    const handleLogout = () => {
        const { currentUser, updateUserData, logoutUser } = useAuthStore.getState();
        const { cart, wishlist, clearShop } = useShopStore.getState();

        // 1. Save data to the user's permanent profile
        if (currentUser) {
            updateUserData(currentUser.email, cart, wishlist);
        }

        // 2. Wipe the active session and shop clean
        logoutUser();
        clearShop();
        sessionStorage.clear();
        navigate("/", { replace: true });
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
                    <div className="relative w-full md:max-w-md lg:max-w-lg flex-1 rounded-2xl">
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