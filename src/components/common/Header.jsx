import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Header({ searchTerm, setSearchTerm }) {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    // Check and update cart count when component mounts or event fires
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartCount(cart.length);
        };
        updateCartCount();

        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    const handleLogout = () => {
        // Remove only the specific session keys to avoid deleting registered accounts.
        // Note: Change "currentUser" and "isLoggedIn" to the exact keys you set in your Login.jsx!
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <header className="bg-white shadow-md py-4 px-6 md:px-8 sticky top-0 z-50 w-full">
            <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <Sidebar />
                    <div className="text-3xl font-extrabold text-purple-700 tracking-wide shrink-0">
                        ShopZone
                    </div>
                </div>

                {setSearchTerm && (
                    <div className="relative w-full md:max-w-md lg:max-w-lg flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-11 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0 w-full md:w-auto overflow-x-auto">
                    <nav className="flex gap-4 md:gap-6 text-gray-600 font-medium whitespace-nowrap">
                        <Link to="/home" className="hover:text-purple-600 transition">Home</Link>
                        <Link to="/about" className="hover:text-purple-600 transition">About Us</Link>
                    </nav>
                    <div className="flex gap-1">
                        <button onClick={() => navigate('/cart')} title="Cart" className="relative bg-purple-600 text-white px-3 py-3 md:px-3 md:py-3 rounded-full text-xl hover:bg-purple-800 transition">
                            <FiShoppingCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-extrabold min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button onClick={handleLogout} title="Logout" className="bg-purple-600 text-white px-3 py-3 md:px-3.5 md:py-3 rounded-3xl text-lg hover:bg-purple-800 transition">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}