import React, { useState } from "react";
import products from "../pages/products.json";
import ProductCard from "../components/products/ProductCard";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">

            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 max-w-8xl mx-auto w-full">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
                        Product Collection
                    </h1>
                    <p className="hidden sm:block text-gray-500 font-medium">{filteredProducts.length} Items</p>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg py-20">No products found.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
