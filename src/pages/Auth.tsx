import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "@/lib/utils";

type AuthMode = "login" | "signup";

const Auth = () => {
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "signup") {
                const res = await fetch(`${BASE_URL}/api/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, fullName })
                });
                const data = await res.json();
                if (data.status === "success") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    await refreshCart();
                    toast.success("Account created successfully!");
                    navigate("/");
                } else {
                    toast.error(data.message || "Failed to create account");
                }
            } else {
                const res = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.status === "success") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    await refreshCart();
                    toast.success("Welcome back!");
                    navigate("/");
                } else {
                    toast.error(data.message || "Invalid credentials");
                }
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-[22px] font-medium text-[#1A1A1A] tracking-tight mb-1.5">
                            {mode === "login" ? "Sign in" : "Create account"}
                        </h2>
                        <p className="text-[13px] text-[#8A8A8A]">
                            {mode === "login" ? "Welcome back to Base." : "Join the Base community."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form 
                            key={mode}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {mode === "signup" && (
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-medium text-[#4A4A4A]">Full name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white border border-[#E8E5E0] px-4 py-3 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-[#4A4A4A]">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-[#E8E5E0] px-4 py-3 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] font-medium text-[#4A4A4A]">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-[#E8E5E0] px-4 py-3 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full mt-2 bg-[#1A1A1A] hover:bg-[#333] text-white py-3.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {mode === "login" ? "Sign in" : "Create account"}
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="mt-6 pt-6 border-t border-[#E8E5E0] text-center">
                        {mode === "login" ? (
                            <p className="text-[13px] text-[#8A8A8A]">
                                Don't have an account?{" "}
                                <button onClick={() => setMode("signup")} className="text-[#1A1A1A] font-medium hover:underline underline-offset-2">
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p className="text-[13px] text-[#8A8A8A]">
                                Already have an account?{" "}
                                <button onClick={() => setMode("login")} className="text-[#1A1A1A] font-medium hover:underline underline-offset-2">
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default Auth;
