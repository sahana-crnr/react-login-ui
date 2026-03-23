import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Button from "../components/common/Button";

// 1. Define the validation schema for the email
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
});

export default function ForgotPassword() {
    const navigate = useNavigate();

    // 2. Initialize react-hook-form
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    // 3. Handle form submission
    const onSubmit = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if the email exists in local storage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = existingUsers.some(u => u.email === data.email);

        if (!userExists) {
            toast.error("Email not registered.");
            setError("email", { type: "manual", message: "Email not registered." });
            return;
        }

        toast.success("Password reset link sent to your email!", { duration: 5000 });
        console.log("Password reset requested for:", data.email);

        // Redirect back to login
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 relative">
                <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-4">Reset Password</h2>
                <p className="text-gray-600 text-sm text-center mb-6">Enter your registered email to receive a password reset link.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="mt-6">
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-6">
                    Remember your password? <Link to="/" className="text-purple-600 font-bold hover:text-purple-800 transition">Login</Link>
                </p>
            </div>
        </div>
    );
}