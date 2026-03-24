import React, { useState, useEffect, useRef } from "react";
import products from "../pages/products.json";
import ProductCard from "../components/products/ProductCard";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaFilter } from "react-icons/fa";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Filter States
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinPrice = minPrice === "" || product.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || product.price <= Number(maxPrice);
        const matchesRating = (product.rating || 4.3) >= minRating;
        const matchesReviews = minReviews === "" || (product.reviewsCount || 854) >= Number(minReviews);

        return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesRating && matchesReviews;
    });

    // Apply sorting to the filtered products
    const displayProducts = [...filteredProducts];
    if (sortBy === "price-asc") {
        displayProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        displayProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
        displayProducts.sort((a, b) => (b.rating || 4.3) - (a.rating || 4.3));
    }

    // Close filters when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">

            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 max-w-8xl mx-auto w-full">
                <div className="flex justify-between items-end mb-8 relative">
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
                        Product Collection
                    </h1>
                    <div className="flex items-center gap-4" ref={filterRef}>
                        <p className="hidden sm:block text-gray-500 font-medium">{displayProducts.length} Items</p>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 px-1 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
                        >
                            <option value="default">Sort by:Default</option>
                            <option value="price-asc">Price:Low to High</option>
                            <option value="price-desc">Price:High to Low</option>
                            <option value="rating-desc">Rating:High to Low</option>
                        </select>

                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-white border border-gray-300 text-gray-700 px-2 py-2 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition  shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                            <FaFilter /> Filters
                        </button>

                        {/* Floating Filters */}
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-3 w-full max-w-sm sm:w-80 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 z-40">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Filters</h2>

                                <div className="mb-5">
                                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">Price Range (₹)</h3>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                                        <span className="text-gray-500">-</span>
                                        <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">Minimum Rating</h3>
                                    <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                                        <option value={0}>All Ratings</option>
                                        <option value={4}>4 Stars & Up</option>
                                        <option value={3}>3 Stars & Up</option>
                                        <option value={2}>2 Stars & Up</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">Minimum Reviews</h3>
                                    <input type="number" placeholder="e.g. 100" value={minReviews} onChange={e => setMinReviews(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                                </div>

                                <button onClick={() => { setMinPrice(""); setMaxPrice(""); setMinRating(0); setMinReviews(""); }} className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                {displayProducts.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-20 bg-white rounded-2xl shadow-sm border border-gray-200">No products found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
