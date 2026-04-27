import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBolt,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaTag,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Button } from "../components/ui/button";
import useShopStore from "../store/useShopStore";
import { Product } from "../types/shop";
import { toIconComponent } from "../utils/icons";
import { fetchProductById } from "../api/products";

const ArrowLeftIcon = toIconComponent(FaArrowLeft);
const StarIcon = toIconComponent(FaStar);
const TagIcon = toIconComponent(FaTag);
const BoltIcon = toIconComponent(FaBolt);
const HeartIcon = toIconComponent(FaHeart);
const HeartOutlineIcon = toIconComponent(FaRegHeart);
const ShoppingCartIcon = toIconComponent(FaShoppingCart);
const ShareIcon = toIconComponent(FiShare2);

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const { data, isLoading, isError } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(productId),
    enabled: !Number.isNaN(productId),
  });

  const wishlist = useShopStore((state) => state.wishlist) as Product[];
  const toggleWishlist = useShopStore((state) => state.toggleWishlist) as (
    product: Product,
  ) => void;
  const addToCart = useShopStore((state) => state.addToCart) as (
    product: Product,
  ) => void;

  const handleWishlist = useCallback(() => {
    if (data) {
      toggleWishlist(data);
    }
  }, [data, toggleWishlist]);

  const handleShare = useCallback(async () => {
    if (!data) {
      return;
    }

    const productUrl = `${window.location.origin}/product/${data.id}`;
    const shareData = {
      title: data.name,
      text: `Check out ${data.name} at ShopZone!`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(productUrl);
      toast.success("Product link copied to clipboard!");
    }
  }, [data]);

  const handleAddToCart = useCallback(() => {
    if (data) {
      addToCart(data);
    }
  }, [addToCart, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading product...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Product not found
          </h2>
          <Button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const originalPrice = data.originalPrice || Math.round(data.price * 1.35);
  const discount = Math.round(
    ((originalPrice - data.price) / originalPrice) * 100,
  );

  const rating = data.rating || 4.3;
  const ratingsCount = data.ratingsCount
    ? data.ratingsCount.toLocaleString()
    : "8,543";
  const reviewsCount = data.reviewsCount
    ? data.reviewsCount.toLocaleString()
    : "854";
  const isWishlisted = wishlist.some((item) => item.id === data.id);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 p-2 md:p-4 pb-20">
        <div className="max-w-[1200px] mx-auto mb-4 mt-2 ">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <ArrowLeftIcon /> Back to Products
          </Button>
        </div>

        <div className="max-w-[1200px] mx-auto bg-card flex flex-col md:flex-row shadow-sm rounded-2xl border border-border">
          <div className="relative w-full md:w-2/5 p-4 md:p-6 border-r border-border flex flex-col items-center">
            <div className="flex-1 w-full flex items-center justify-center py-6 md:py-10">
              <img
                src={
                  data.image?.startsWith("/")
                    ? process.env.PUBLIC_URL + data.image
                    : data.image
                }
                alt={data.name}
                className="max-w-full max-h-[420px] object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-3">
              <button
                onClick={handleWishlist}
                className="bg-card p-2.5 rounded-full shadow-sm border border-border text-muted-foreground hover:text-red-500 hover:bg-muted/70 transition-colors"
                title="Wishlist"
              >
                {isWishlisted ? (
                  <HeartIcon className="text-red-500 text-xl" />
                ) : (
                  <HeartOutlineIcon className="text-xl" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="bg-card p-2.5 rounded-full shadow-sm border border-border text-muted-foreground hover:text-blue-600 hover:bg-muted/70 transition-colors"
                title="Share"
              >
                <ShareIcon className="text-xl" />
              </button>
            </div>

            <div className="flex w-full gap-2 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 whitespace-nowrap text-center "
              >
                <ShoppingCartIcon /> ADD TO CART
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 whitespace-nowrap text-center ">
                <BoltIcon /> BUY NOW
              </Button>
            </div>
          </div>

          <div className="w-full md:w-3/5 p-4 md:p-8">
            <h1 className="text-lg md:text-xl font-medium text-foreground mb-2">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded-sm text-xs font-bold flex items-center">
                {rating} <StarIcon className="w-3 h-3 ml-1" />
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                {ratingsCount} Ratings & {reviewsCount} Reviews
              </span>
            </div>

            <div className="mb-6">
              <span className="text-purple-600 text-sm font-bold dark:text-purple-300">
                Special price
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-medium text-foreground">
                  ₹{data.price}
                </span>
                <span className="text-muted-foreground line-through text-base">
                  ₹{originalPrice}
                </span>
                <span className="text-purple-600 font-bold text-base">
                  {discount}% off
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-medium text-foreground mb-3">
                Available offers
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <TagIcon className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-bold">Bank Offer:</span> 5% Cashback
                    on Flipkart Axis Bank Card{" "}
                    <span className="text-blue-600 font-medium cursor-pointer dark:text-blue-300">
                      T&C
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <TagIcon className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-bold">Special Price:</span> Get extra
                    10% off (price inclusive of cashback/coupon){" "}
                    <span className="text-blue-600 font-medium cursor-pointer dark:text-blue-300">
                      T&C
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6 border-t border-border pt-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {data.description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  More about that product
                </h3>
                <div className="flex flex-wrap gap-3 text-sm font-medium text-muted-foreground">
                  <span className="bg-background px-4 py-2 rounded-2xl border border-border shadow-sm text-foreground dark:bg-card">
                    Color:{" "}
                    <span className="font-bold text-purple-700 dark:text-purple-300">
                      {data.color}
                    </span>
                  </span>
                  <span className="bg-background px-4 py-2 rounded-2xl border border-border shadow-sm text-foreground dark:bg-card">
                    Size:{" "}
                    <span className="font-bold text-purple-700 dark:text-purple-300">
                      {data.size}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
