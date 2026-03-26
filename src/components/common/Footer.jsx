import React from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-auto w-full">
            <div className="max-w-8xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h2 className="text-xl font-bold text-purple-400 mb-4">ShopZone</h2>
                    <p className="text-gray-400 text-sm">Your one-stop destination for all your shopping needs. Quality products at the best prices.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li><Link to="/home" className="hover:text-white transition">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
                        <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                    </ul>
                </div>
                <div className="flex flex-col md:items-end">
                    <div className="w-full md:w-max">
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates.</p>
                        <form className="flex justify-center md:justify-start" onSubmit={e => e.preventDefault()}>
                            <label htmlFor="newsletter-email" className="sr-only">Newsletter Email</label>
                            <Input id="newsletter-email" name="email" autoComplete="email" type="email" placeholder="Enter your email" className="rounded-r-none text-gray-900" />
                            <Button type="submit" className="rounded-l-none bg-purple-600 hover:bg-purple-800">Subscribe</Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
                <p>© 2026 ShopZone. All rights reserved.</p>
            </div>
        </footer>
    );
}