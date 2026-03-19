import React, { useState } from "react";
import products from "../pages/products.json";
import ProductCard from "../components/ProductCard";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="  bg-gray-100 min-h-screen bg-gray-50 flex flex-col">

            {/* Header Navigation */}
            <header className="bg-white shadow-md py-4 px-6 md:px-10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-3xl font-extrabold text-purple-700 tracking-wide shrink-0">
                        ShopZone
                    </div>

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

                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0 w-full md:w-auto overflow-x-auto">
                        <nav className="flex gap-4 md:gap-6 text-gray-600 font-medium whitespace-nowrap">
                            <Link to="/home" className="hover:text-purple-600 transition">Home</Link>
                            <Link to="/products" className="hover:text-purple-600 transition">Products</Link>
                            <Link to="/about" className="hover:text-purple-600 transition">About Us</Link>
                        </nav>
                        <button className="bg-purple-600 text-white px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-purple-800 transition shadow-md whitespace-nowrap">
                            Cart (0)
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8.5 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">
                        Product Collection
                    </h1>
                    <p className="hidden sm:block text-gray-500 font-medium">{filteredProducts.length} Items</p>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-20">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-10 mt-auto">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h2 className="text-xl font-bold text-purple-400 mb-4">ShopZone</h2>
                        <p className="text-gray-400 text-sm">Your one-stop destination for all your shopping needs. Quality products at the best prices.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li><Link to="/home" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
                            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates.</p>
                        <div className="flex justify-center md:justify-start">
                            <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-md w-full md:w-auto text-gray-900 outline-none focus:ring-2 focus:ring-purple-500" />
                            <button className="bg-purple-600 px-4 py-2 rounded-r-md hover:bg-purple-700 transition">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                    <p>© 2026 ShopZone. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
