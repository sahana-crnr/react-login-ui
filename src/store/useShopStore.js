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
            isCartOpen: false,

            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            setCart: (cart) => set({ cart }),
            setWishlist: (wishlist) => set({ wishlist }),

            addToCart: (product) => {
                const { cart, openCart } = get();
                const existingItem = cart.find((item) => item.id === product.id);

                if (existingItem) {
                    const updatedCart = cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                    set({ cart: updatedCart });
                    toast.success("Item quantity updated!");
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                    toast.success("Added to Cart!");
                }
                openCart();
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
            version: undefined,
        }
    )
);

export default useShopStore;

// Derived State Selectors (Auto-Calculations)
export const getCartTotalItems = (state) => state.cart.length;
export const getCartTotalPrice = (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);