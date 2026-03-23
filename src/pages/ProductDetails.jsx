import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "./products.json";
import { FaArrowLeft, FaStar, FaTag, FaBolt, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart, FiShare2 } from "react-icons/fi";
import Button from "../components/common/Button";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import toast from "react-hot-toast";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === parseInt(id));

    const [isWishlisted, setIsWishlisted] = useState(false);

    // Check if item is already in the wishlist on initial load
    useEffect(() => {
        if (product) {
            const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (wishlist.some((item) => item.id === product.id)) {
                setIsWishlisted(true);
            }
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                    <Button onClick={() => navigate(-1)} className="w-auto px-6">Go Back</Button>
                </main>
                <Footer />
            </div>
        );
    }

    // Use dynamic data from products.json, or fallback to mock data
    const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    const rating = product.rating || 4.3;
    const ratingsCount = product.ratingsCount ? product.ratingsCount.toLocaleString() : "8,543";
    const reviewsCount = product.reviewsCount ? product.reviewsCount.toLocaleString() : "854";

    const handleWishlist = () => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (isWishlisted) {
            wishlist = wishlist.filter((item) => item.id !== product.id);
            toast.success("Removed from Wishlist!");
        } else {
            wishlist.push(product);
            toast.success("Added to Wishlist!");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsWishlisted(!isWishlisted);
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    const handleShare = async () => {
        const productUrl = `${window.location.origin}/product/${product.id}`;
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} at ShopZone!`,
            url: productUrl,
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) { console.error("Error sharing:", err); }
        } else {
            navigator.clipboard.writeText(productUrl);
            toast.success("Product link copied to clipboard!");
        }
    };

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.some((item) => item.id === product.id)) {
            toast.error("Item already in cart!");
        } else {
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            toast.success("Added to Cart!");
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />

            <main className="flex-1 p-2 md:p-4 pb-20">
                {/* Back Navigation */}
                <div className="max-w-[1200px] mx-auto mb-4 mt-2">
                    <Button onClick={() => navigate(-1)} className="w-auto px-4 flex items-center gap-2">
                        <FaArrowLeft /> Back to Products
                    </Button>
                </div>

                <div className="max-w-[1200px] mx-auto bg-white flex flex-col md:flex-row shadow-sm rounded-2xl border border-gray-200">

                    {/* Left Column - Image & Action Buttons */}
                    <div className="w-full md:w-2/5 p-4 md:p-6 border-r border-gray-100 flex flex-col items-center">
                        <div className="relative w-full h-80 md:h-96 flex justify-center items-center p-4 border border-gray-100 rounded-sm mb-4">
                            <img src={product.image?.startsWith('/') ? process.env.PUBLIC_URL + product.image : product.image} alt={product.name} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" />

                            <div className="absolute top-3 right-3 flex flex-col gap-3">
                                <button onClick={handleWishlist} className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors" title="Wishlist">
                                    {isWishlisted ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-xl" />}
                                </button>
                                <button onClick={handleShare} className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-colors" title="Share">
                                    <FiShare2 className="text-xl" />
                                </button>
                            </div>
                        </div>

                        <div className="flex w-full gap-2 mt-auto">
                            <Button onClick={handleAddToCart} className="w-auto px-4 flex items-center gap-2">
                                <FiShoppingCart /> ADD TO CART
                            </Button> 
                            <Button className="w-auto px-4 flex items-center gap-2">
                                <FaBolt /> BUY NOW
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="w-full md:w-3/5 p-4 md:p-8">

                        {/* Title & Rating */}
                        <h1 className="text-lg md:text-xl font-medium text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded-sm text-xs font-bold flex items-center">
                                {rating} <FaStar className="w-3 h-3 ml-1" />
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{ratingsCount} Ratings & {reviewsCount} Reviews</span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6">
                            <span className="text-purple-600 text-sm font-bold">Special price</span>
                            <div className="flex items-baseline gap-3 mt-1">
                                <span className="text-3xl font-medium text-gray-900">₹{product.price}</span>
                                <span className="text-gray-500 line-through text-base">₹{originalPrice}</span>
                                <span className="text-purple-600 font-bold text-base">{discount}% off</span>
                            </div>
                        </div>

                        {/* Offers Section */}
                        <div className="mb-6">
                            <h3 className="text-base font-medium text-gray-900 mb-3">Available offers</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <FaTag className="text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span><span className="font-bold">Bank Offer:</span> 5% Cashback on Flipkart Axis Bank Card <span className="text-blue-600 font-medium cursor-pointer">T&C</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FaTag className="text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span><span className="font-bold">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-blue-600 font-medium cursor-pointer">T&C</span></span>
                                </li>
                            </ul>
                        </div>

                        {/* Description & More about that product */}
                        <div className="flex flex-col gap-6 border-t border-gray-200 pt-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">More about that product</h3>
                                <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-700">
                                    <span className="bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">Color: <span className="text-purple-700 font-bold">{product.color}</span></span>
                                    <span className="bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">Size: <span className="text-purple-700 font-bold">{product.size}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}