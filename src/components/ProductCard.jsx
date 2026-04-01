import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { Button, iconActionButtonClass } from "./ui/button";
import useShopStore from "../store/useShopStore";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    const wishlist = useShopStore((state) => state.wishlist);
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);

    const isWishlisted = wishlist.some((item) => item.id === product.id);

    const handleWishlist = (e) => {
        e.stopPropagation(); // Prevents clicking the card and navigating
        toggleWishlist(product);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const productUrl = `${window.location.origin}/product/${product.id}`;

        const shareData = {
            title: product.name,
            text: `Check out ${product.name} at ShopZone!`,
            url: productUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback for browsers that don't support native share
            navigator.clipboard.writeText(productUrl);
            toast.success("Product link copied to clipboard!");
        }
    };

    return (
        <div onClick={() => navigate(`/product/${product.id}`)} className="relative bg-card border border-border rounded-2xl shadow-lg w-full overflow-hidden hover:scale-105 transition flex flex-col gap-4 cursor-pointer">

            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                <Button onClick={handleWishlist} variant="ghost" size="icon" className={iconActionButtonClass} title="Wishlist">
                    {isWishlisted ? <FaHeart className="text-red-600 text-xl" /> : <FaRegHeart className="text-lg drop-shadow-sm" />}
                </Button>

                <Button onClick={handleShare} variant="ghost" size="icon" className={`${iconActionButtonClass} hover:text-blue-500`} title="Share">
                    <FiShare2 className="text-lg drop-shadow-sm" />
                </Button>
            </div>

            <div className="flex justify-center p-4 bg-purple-900" style={{
                backgroundImage: `
      repeating-linear-gradient( rgba(255, 255, 255, 0.88) 0, transparent 0px),
      linear-gradient(to right, rgba(108, 108, 108, 0.56), rgb(249, 247, 251))
    `, backgroundBlendMode: 'overlay'
            }}>
                <img
                    src={product.image?.startsWith('/') ? process.env.PUBLIC_URL + product.image : product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                />
            </div>

            <div className="bg-card relative z-10 -mt-8 border border-border px-4 py-4 rounded-2xl flex flex-col flex-1">

                <h2 className="text-sm md:text-lg font-bold text-foreground">
                    {product.name}
                </h2>

                <div className="flex gap-4 mt-2 text-xs">
                    <span className="border border-border px-2 py-1 rounded text-muted-foreground">{product.size}</span>
                    <span className="border border-border px-2 py-1 rounded text-muted-foreground">{product.color}</span>
                </div>

                <p className="text-muted-foreground mt-1.5 text-xs md:text-sm">
                    {product.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm text-muted-foreground line-through">₹ {product.originalPrice}</span>
                        <span className="text-md font-bold text-foreground">₹ {product.price}</span>
                    </div>
                    <span className="text-sm text-green-600 font-bold">{discount}% off</span>
                </div>

            </div>
        </div>
    );
}

export default ProductCard;
