import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaSort, FaFilter, FaSpinner } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import products from "./products.json";
import ProductCard from "../components/ProductCard"; // Adjust import path if needed

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const filterRef = useRef(null);
    const sortRef = useRef(null);

    // Filter States
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState("");
    const [sortBy, setSortBy] = useState("default");

    // Pagination / Infinite Scroll States
    const [visibleCount, setVisibleCount] = useState(8);
    const { ref, inView } = useInView({
        /* Triggers the load 400px before the user actually reaches the bottom */
        rootMargin: "400px",
    });

    // Ensure products is a valid array to prevent fatal crashes on load
    const safeProducts = Array.isArray(products) ? products : [];
    const filteredProducts = safeProducts.filter((product) => {
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
    } else if (sortBy === "name-asc") {
        displayProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
        displayProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    const paginatedProducts = displayProducts.slice(0, visibleCount);
    const hasMore = visibleCount < displayProducts.length;

    // Handle infinite scroll using intersection observer
    useEffect(() => {
        if (inView && hasMore) {
            setVisibleCount((prevCount) => prevCount + 8);
        }
    }, [inView, hasMore]);

    // Close filters when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
                    <div className="flex items-center gap-4">
                        <p className="hidden sm:block text-gray-500 font-medium">{displayProducts.length} Items</p>

                        {/* Sort Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                                <FaSort /> Sort By
                            </button>
                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-3 w-48 bg-white p-3 rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col gap-1 text-sm font-medium text-gray-700">
                                    <button onClick={() => { setSortBy("default"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "default" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Default</button>
                                    <button onClick={() => { setSortBy("price-asc"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "price-asc" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Price: Low to High</button>
                                    <button onClick={() => { setSortBy("price-desc"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "price-desc" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Price: High to Low</button>
                                    <button onClick={() => { setSortBy("rating-desc"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "rating-desc" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Rating: High to Low</button>
                                    <button onClick={() => { setSortBy("name-asc"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "name-asc" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Name: A to Z</button>
                                    <button onClick={() => { setSortBy("name-desc"); setIsSortOpen(false); }} className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${sortBy === "name-desc" ? "bg-gray-100 font-bold text-purple-700" : ""}`}>Name: Z to A</button>
                                </div>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium">
                                <FaFilter /> Filters
                            </button>

                            {/* Floating Filters */}
                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-3 w-full max-w-sm sm:w-80 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 z-40">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Filters</h2>

                                    <div className="mb-5">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">Price Range (₹)</h3>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" min="0" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))} className="h-9 text-sm" />
                                            <span className="text-gray-500">-</span>
                                            <Input type="number" min="0" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))} className="h-9 text-sm" />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">Minimum Rating</h3>
                                        <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value={0}>All Ratings</option>
                                            <option value={4}>4 Stars & Up</option>
                                            <option value={3}>3 Stars & Up</option>
                                            <option value={2}>2 Stars & Up</option>
                                        </select>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">Minimum Reviews</h3>
                                        <Input type="number" min="0" placeholder="e.g. 100" value={minReviews} onChange={e => setMinReviews(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))} className="h-9 text-sm" />
                                    </div>

                                    <Button onClick={() => { setMinPrice(""); setMaxPrice(""); setMinRating(0); setMinReviews(""); }} className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {displayProducts.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-20 bg-white rounded-2xl shadow-sm border border-gray-200">No products found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                {hasMore && (
                    <div ref={ref} className="flex justify-center items-center py-10">
                        <FaSpinner className="animate-spin text-purple-600 text-3xl" />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
