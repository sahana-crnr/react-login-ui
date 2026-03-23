import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import { FaHeartBroken, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();

    const fetchWishlist = () => {
        const items = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistItems(items);
    };

    useEffect(() => {
        fetchWishlist();
        // Re-render instantly if a user clicks the heart to remove an item
        window.addEventListener('wishlistUpdated', fetchWishlist);
        return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
    }, []);

    const handleRemoveItem = (id) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = wishlist.filter((item) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setWishlistItems(wishlist);
        toast.success("Removed from Wishlist!");
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 p-4 md:p-8 max-w-8xl mx-auto w-full">
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Wishlist</h1>
                    <p className="text-gray-500 font-medium mt-1">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <FaHeartBroken className="text-6xl mb-4 text-gray-400 opacity-70" />
                        <p className="text-gray-500 text-lg opacity-70">Your wishlist is currently empty.</p>
                        <Link to="/home">
                            <Button className="mt-6 px-6 py-2 w-auto rounded-2xl">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                    <img src={item.image?.startsWith('/') ? process.env.PUBLIC_URL + item.image : item.image} alt={item.name} className="w-full h-full object-contain hover:scale-105 transition-transform" />
                                </div>

                                <div className="flex-1 flex flex-col text-center sm:text-left">
                                    <h3 className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-600 transition-colors" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                                    <p className="text-purple-700 font-bold text-lg mt-2">₹{item.price}</p>
                                </div>

                                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-full transition-colors" title="Remove">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}