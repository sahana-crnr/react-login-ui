import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Button from "../components/common/Button";
import useShopStore, { getCartTotalItems, getCartTotalPrice } from "../store/useShopStore";

export default function Cart() {
    const navigate = useNavigate();
    const cartItems = useShopStore((state) => state.cart);
    const cartTotalItems = useShopStore(getCartTotalItems);
    const cartTotalPrice = useShopStore(getCartTotalPrice);
    const updateQuantity = useShopStore((state) => state.updateCartQuantity);
    const removeItem = useShopStore((state) => state.removeFromCart);
    const discountPercent = useShopStore((state) => state.discountPercent);
    const discountCode = useShopStore((state) => state.discountCode);
    const applyDiscount = useShopStore((state) => state.applyDiscount);
    const removeDiscount = useShopStore((state) => state.removeDiscount);
    const [couponInput, setCouponInput] = useState("");

    const discountAmount = Math.round(cartTotalPrice * (discountPercent / 100));
    const finalPrice = cartTotalPrice - discountAmount;

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
                <div className="mb-8 border-b pb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
                    <p className="text-gray-500 font-medium mt-1">{cartTotalItems} {cartTotalItems === 1 ? 'Item' : 'Items'} in your cart</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <FiShoppingCart className="text-6xl mb-4 text-gray-400 opacity-70" />
                        <p className="text-gray-500 text-lg opacity-70">Your cart is currently empty.</p>
                        <Link to="/home">
                            <Button className="mt-6 px-6 w-auto">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1 flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                        <img src={item.image?.startsWith('/') ? process.env.PUBLIC_URL + item.image : item.image} alt={item.name} className="w-full h-full object-contain hover:scale-105 transition-transform" />
                                    </div>

                                    <div className="flex-1 flex flex-col text-center sm:text-left">
                                        <h3 className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-600 transition-colors" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                                        <p className="text-purple-700 font-bold text-lg mt-2">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 mt-2 sm:mt-0">
                                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-200 rounded-md transition-colors"><FaMinus size={12} /></button>
                                            <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-200 rounded-md transition-colors"><FaPlus size={12} /></button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-full transition-colors" title="Remove">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Order Summary</h2>

                            {/* Coupon Section */}
                            <div className="flex flex-col gap-2 border-b pb-4">
                                <label className="text-sm font-semibold text-gray-700">Apply Coupon</label>
                                {discountCode ? (
                                    <div className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-200">
                                        <span className="font-bold text-sm">{discountCode} Applied</span>
                                        <button onClick={removeDiscount} className="text-red-500 text-sm font-bold hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Code (e.g. SAVE10)"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm uppercase"
                                        />
                                        <button onClick={() => applyDiscount(couponInput)} className="bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800 transition text-sm">
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-800">₹{cartTotalPrice}</span></div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-600"><span>Discount ({discountPercent}%)</span><span className="font-semibold">-₹{discountAmount}</span></div>
                            )}
                            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-semibold">Free</span></div>
                            <div className="border-t pt-4 mt-2 flex justify-between items-center"><span className="text-lg font-bold text-gray-800">Total</span><span className="text-2xl font-bold text-purple-700">₹{finalPrice}</span></div>
                            <Button className="mt-4 text-lg">Proceed to Checkout</Button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}