import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import { BASE_URL, authHeaders } from "@/lib/utils";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState<{name?: string, email?: string} | null>(null);

    // Run once to grab user session
    useState(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            try {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                setFormData(prev => ({
                    ...prev,
                    name: parsed.fullName || "",
                    email: parsed.email || ""
                }));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Message sent successfully!");
                setIsSuccess(true);
                setFormData({ name: "", email: "", phone: "", message: "" });
                
                // Reset success message after 5 seconds
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                toast.error(data.error || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Contact Form Error:", error);
            toast.error("Network error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-orange-500/30">
            <SEO 
                title="Contact Support | Reach Out to Us"
                description="Have queries about order shipping, garments size guides, or brand collaborations? Send us a direct support message."
                keywords="contact base products, base products support, base products location, base customer care, baseproducts.online contact"
                canonicalUrl="https://baseproducts.online/contact"
            />
            <Navbar />

            {/* Page Header */}
            <section className="bg-zinc-950 text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950 to-zinc-950 opacity-80 z-0"></div>
                <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-orange-500 font-black uppercase tracking-[0.25em] text-[10px] bg-orange-950/40 border border-orange-900/50 px-3 py-1 rounded-full inline-block"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white"
                    >
                        Contact <span className="text-orange-500">Base</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 max-w-md mx-auto text-xs md:text-sm uppercase tracking-wider font-semibold leading-relaxed"
                    >
                        Have questions about sizing, a drop, or your order? We are here to support your journey.
                    </motion.p>
                </div>
            </section>

            {/* Form & Contact Details Section */}
            <div className="flex-1 container mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: Contact Cards */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        {/* Info list */}
                        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-3">
                                Support Channels
                            </h3>
                            
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100/50">
                                        <Mail size={18} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Email Support</p>
                                        <a href="mailto:basecustomer2018@gmail.com" className="text-sm font-bold text-zinc-800 hover:text-orange-600 transition-colors break-all">
                                            basecustomer2018@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-200/60">
                                        <Phone size={18} className="text-zinc-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Direct Line</p>
                                        <a href="tel:+14242063358" className="text-sm font-bold text-zinc-800 hover:text-orange-600 transition-colors">
                                            +1 (424) 206-3358
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-200/60">
                                        <MapPin size={18} className="text-zinc-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Origin</p>
                                        <p className="text-sm font-bold text-zinc-800">
                                            Torrance, CA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Working hours banner */}
                        <div className="bg-zinc-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-zinc-800">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <Clock size={20} className="text-orange-500" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Support Hours</h4>
                            </div>
                            <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans font-medium">
                                Our support staff responds within 24-48 business hours to ensure your needs are fully addressed.
                            </p>
                            <div className="text-xs font-bold uppercase tracking-widest text-orange-500 border-t border-zinc-800 pt-3 flex justify-between">
                                <span>Mon - Fri</span>
                                <span>9am - 5pm PST</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Interactive Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 shadow-sm"
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-6 animate-bounce">
                                        <CheckCircle2 size={32} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-zinc-800 mb-2">Message Sent!</h3>
                                    <p className="text-zinc-550 text-xs uppercase tracking-wider font-semibold max-w-sm leading-relaxed">
                                        We have received your request and will reach back out shortly. Thank you.
                                    </p>
                                </motion.div>
                            ) : !user ? (
                                <motion.div 
                                    key="locked"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 mb-6">
                                        <MessageSquare size={32} className="text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-widest text-zinc-850 mb-2">Members Only</h3>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold max-w-xs mb-8 leading-relaxed">
                                        You must have a registered account to submit support requests.
                                    </p>
                                    <Link 
                                        to="/auth" 
                                        className="py-4 px-10 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-orange-600 transition-colors shadow-md hover:-translate-y-0.5 transform duration-300"
                                    >
                                        Log In / Register
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit} 
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        {/* Email (Disabled/Locked) */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                Email Address <span className="text-zinc-400">(Locked)</span>
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                required
                                                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed opacity-75 font-medium"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            required
                                            onChange={handleChange}
                                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none font-medium"
                                            placeholder="What is your message or inquiry about?"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-orange-650 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={14} />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default ContactUs;
