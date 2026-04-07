import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AuthActionResult } from "../types/shop";
import { toIconComponent } from "../utils/icons";

const EyeIcon = toIconComponent(FaEye);
const EyeSlashIcon = toIconComponent(FaEyeSlash);

const registerSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.registerUser) as (
    email: string,
    password: string,
  ) => AuthActionResult;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = registerUser(data.email, data.password);

    if (!result.success) {
      toast.error(result.message);
      setError("email", { type: "manual", message: result.message });
      return;
    }

    toast.success(result.message, { duration: 5000 });
    console.log("Account created successfully:", data);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="bg-card p-8 rounded-2xl shadow-lg w-full max-w-md border border-border relative">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-3">Account Setup</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              autoComplete="email"
              className={`mt-1 placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                autoComplete="new-password"
                className={`mt-1 placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              autoComplete="new-password"
              className={`mt-1 placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-purple-600 font-bold hover:text-purple-800 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
