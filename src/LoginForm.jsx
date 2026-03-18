import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "./components/Card";
import Button from "./components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        toast.success("You are logged in successfully!");
        navigate("/home");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-purple-300">
            <Card>
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Sign in
                    </h2>

                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        placeholder=" name@example.com"
                        className="w-full border border-gray-500 placeholder-gray-600 rounded-full px-4 py-2"
                    />

                    <label className="block mt-4 mb-2">Password</label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" Enter password"
                            className="w-full border border-gray-500 placeholder-gray-600 rounded-full px-4 py-2 pr-10"
                        />

                        <span
                            className="absolute inset-y-0 right-5 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="mt-6">
                        <Button type="submit">Sign in</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}