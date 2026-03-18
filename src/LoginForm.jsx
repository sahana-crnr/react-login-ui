import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "./components/Card";
import Button from "./components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.trim() === "") {
            toast.error("Please enter your password.");
            return;
        }

        toast.success("You are logged in successfully!", { duration: 5000 });
        navigate("/home");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-400 backdrop-blur-lg">
            <Card className="rounded-2xl w-80 transform scale-90 sm:scale-100 md:scale-110 lg:scale-125 transition-transform duration-300">
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Sign in
                    </h2>

                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        placeholder=" name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-200 placeholder-gray-600 rounded-2xl px-4 py-2"
                    />

                    <label className="block mt-4 mb-2">Password</label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 placeholder-gray-600 rounded-2xl px-4 py-2 pr-10"
                        />

                        <span
                            className="absolute inset-y-0 right-5 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="mt-6">
                        <Button type="submit" className="rounded-2xl">Sign in</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}