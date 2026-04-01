import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useShopStore from "../store/useShopStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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

        // 4. Fetch the newly logged-in user from the auth store
        const { currentUser } = useAuthStore.getState();
        const { setCart, setWishlist } = useShopStore.getState();

        // Use currentUser from state, or fallback to result.user if auth store uses it
        const loggedInUser = currentUser || result.user;

        // 5. Restore the specific user's saved cart and wishlist
        if (loggedInUser) {
            if (setCart) setCart(loggedInUser.cart || []);
            if (setWishlist) setWishlist(loggedInUser.wishlist || []);
        }

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
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            autoComplete="email"
                            className={`mt-1 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register("password")}
                                autoComplete="current-password"
                                className={`mt-1 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-700"
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
                        <Label htmlFor="rememberMe" className="flex items-center space-x-2 font-normal text-gray-600 cursor-pointer">
                            <input id="rememberMe" name="rememberMe" type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-purple-600" />
                            <span>Remember me</span>
                        </Label>
                        <Link to="/forgot-password" className="text-purple-600 font-medium hover:text-purple-800 transition">Forgot password?</Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
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