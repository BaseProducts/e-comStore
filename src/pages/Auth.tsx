import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "@/lib/utils";

type AuthMode = "login" | "signup";

const Auth = () => {
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
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
                    toast.success("Account created successfully! Welcome.");
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
                    toast.success("Login successful! Welcome back.");
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
        <div className="min-h-screen bg-background font-mono selection:bg-primary/30 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
                <div className="w-full max-w-md relative">
                    {/* Background Decorative Frame */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-background to-primary/20 rounded-lg blur opacity-50"></div>
                    
                    <div className="relative bg-card border border-border rounded-md shadow-2xl overflow-hidden p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black uppercase tracking-widest mb-2">BASE</h2>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                {mode === "login" && "Access Your Account"}
                                {mode === "signup" && "Join The Movement"}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.form 
                                key={mode}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {mode === "signup" && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                                <User size={16} />
                                            </div>
                                            <input 
                                                type="text" 
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full bg-background border border-border rounded pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                            <Mail size={16} />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-background border border-border rounded pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                            <Lock size={16} />
                                        </div>
                                        <input 
                                            type="password" 
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-background border border-border rounded pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full mt-6 gradient-btn font-bold tracking-[0.2em] uppercase py-4 rounded flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {mode === "login" && "Sign In"}
                                            {mode === "signup" && "Create Account"}
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-8 pt-6 border-t border-border text-center">
                            {mode === "login" && (
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                    Don't have an account?{" "}
                                    <button onClick={() => setMode("signup")} className="text-foreground font-bold hover:text-primary transition-colors ml-1">
                                        Sign Up
                                    </button>
                                </p>
                            )}
                            {mode === "signup" && (
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                    Already have an account?{" "}
                                    <button onClick={() => setMode("login")} className="text-foreground font-bold hover:text-primary transition-colors ml-1">
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
