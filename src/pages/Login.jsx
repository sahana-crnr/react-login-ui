import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import useAuthStore from "../store/useAuthStore";
import useShopStore from "../store/useShopStore";

// 1. Define the validation schema for login
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const loginUser = useAuthStore(state => state.loginUser);
    const setShop = useShopStore(state => state.setShop);

    // 2. Initialize react-hook-form with the Zod resolver
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    // 3. Handle the form submission
    const onSubmit = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const result = loginUser(data.email, data.password);

        if (!result.success) {
            toast.error(result.message);
            setError(result.field, { type: "manual", message: result.message });
            return;
        }

        // Load the specific user's saved cart and wishlist
        setShop(result.user.cart || [], result.user.wishlist || []);

        toast.success(result.message, { duration: 5000 });
        console.log("Login submitted successfully:", data);
        // Redirect to the Home page after successful submission
        navigate("/home", { replace: true });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 relative">
                <h2 className="text-3xl font-bold text-center text-purple-900 mb-3">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            autoComplete="email"
                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                                }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register("password")}
                                autoComplete="current-password"
                                className={`w-full px-4 py-2 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label htmlFor="rememberMe" className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                            <input id="rememberMe" name="rememberMe" type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-purple-600 font-medium hover:text-purple-800 transition">Forgot password?</Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Don't have an account? <Link to="/register" className="text-purple-600 font-bold hover:text-purple-800 transition">Sign up</Link>
                </p>
            </div>
        </div>
    );
}