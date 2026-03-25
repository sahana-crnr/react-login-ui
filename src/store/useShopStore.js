import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useShopStore = create(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            discountCode: "",
            discountPercent: 0,

            addToCart: (product) => {
                const { cart } = get();
                if (cart.some((item) => item.id === product.id)) {
                    toast.error("Item already in cart!");
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                    toast.success("Added to Cart!");
                }
            },

            updateCartQuantity: (id, delta) => {
                const { cart } = get();
                const newCart = cart.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + delta };
                    }
                    return item;
                }).filter(item => item.quantity > 0);
                set({ cart: newCart });
            },

            removeFromCart: (id) => {
                const { cart } = get();
                set({ cart: cart.filter(item => item.id !== id) });
            },

            toggleWishlist: (product) => {
                const { wishlist } = get();
                const isWishlisted = wishlist.some(item => item.id === product.id);
                if (isWishlisted) {
                    set({ wishlist: wishlist.filter(item => item.id !== product.id) });
                    toast.success("Removed from Wishlist!");
                } else {
                    set({ wishlist: [...wishlist, product] });
                    toast.success("Added to Wishlist!");
                }
            },

            removeFromWishlist: (id) => {
                const { wishlist } = get();
                set({ wishlist: wishlist.filter(item => item.id !== id) });
                toast.success("Removed from Wishlist!");
            },

            applyDiscount: (code) => {
                if (code === "SAVE10") {
                    set({ discountCode: code, discountPercent: 10 });
                    toast.success("10% discount applied!");
                } else if (code === "SAVE20") {
                    set({ discountCode: code, discountPercent: 20 });
                    toast.success("20% discount applied!");
                } else {
                    toast.error("Invalid discount code!");
                }
            },

            removeDiscount: () => {
                set({ discountCode: "", discountPercent: 0 });
                toast.success("Discount removed!");
            },

            setShop: (cart, wishlist) => {
                set({ cart, wishlist, discountCode: "", discountPercent: 0 });
            },

            clearShop: () => {
                set({ cart: [], wishlist: [], discountCode: "", discountPercent: 0 });
            }
        }),
        {
            name: 'shop-storage', // The key used in localStorage
        }
    )
);

export default useShopStore;

// Derived State Selectors (Auto-Calculations)
export const getCartTotalItems = (state) => state.cart.reduce((total, item) => total + item.quantity, 0);
export const getCartTotalPrice = (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);