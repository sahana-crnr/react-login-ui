import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

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

        // Fetch registered users from local storage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = existingUsers.find(u => u.email === data.email);

        if (!user) {
            toast.error("Email not registered. Please sign up.");
            setError("email", { type: "manual", message: "Email not registered. Please sign up." });
            return;
        }
        if (user.password !== data.password) {
            toast.error("Incorrect password.");
            setError("password", { type: "manual", message: "Incorrect password." });
            return;
        }

        toast.success("You are logged in successfully!", { duration: 5000 });
        console.log("Login submitted successfully:", data);
        // Redirect to the Home page after successful submission
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 relative">
                <h2 className="text-3xl font-bold text-center text-purple-900 mb-3">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email")}
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password")}
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
                        <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-purple-600 font-medium hover:text-purple-800 transition">Forgot password?</Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md mt-6"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Don't have an account? <Link to="/register" className="text-purple-600 font-bold hover:text-purple-800 transition">Sign up</Link>
                </p>
            </div>
        </div>
    );
}