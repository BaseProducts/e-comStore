import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Check credentials against .env variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            localStorage.setItem("isAdminAuthenticated", "true");
            toast.success("Successfully logged in as admin!");
            navigate("/admin-panel");
        } else {
            toast.error("Invalid admin credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7] px-6">
            <div className="w-full max-w-sm border border-[#E8E5E0] bg-white p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-10 h-10 bg-[#F5F3F0] flex items-center justify-center mb-4">
                        <Lock className="text-[#1A1A1A] w-4 h-4" />
                    </div>
                    <h2 className="text-[20px] font-medium text-[#1A1A1A] tracking-tight mb-1">Admin Portal</h2>
                    <p className="text-[13px] text-[#8A8A8A]">Enter your credentials to manage Base.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-[#4A4A4A] flex items-center gap-1.5">
                            <Mail size={12} className="text-[#8A8A8A]" /> Admin Email
                        </label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-[#4A4A4A] flex items-center gap-1.5">
                            <Lock size={12} className="text-[#8A8A8A]" /> Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full mt-2 bg-[#1A1A1A] hover:bg-[#333] text-white py-3.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
                        Access Panel <ArrowRight size={14} />
                    </button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-[#E8E5E0] text-center">
                    <a href="/" className="text-[12px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">
                        Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
