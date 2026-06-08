import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import { BASE_URL, authHeaders } from "@/lib/utils";

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState<{name?: string, email?: string} | null>(null);

    useState(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            try {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                setFormData(prev => ({ ...prev, name: parsed.fullName || "", email: parsed.email || "" }));
            } catch (e) { console.error("Failed to parse user data", e); }
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
                headers: { "Content-Type": "application/json", ...authHeaders() },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Message sent successfully!");
                setIsSuccess(true);
                setFormData(prev => ({ ...prev, message: "" }));
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                toast.error(data.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Contact Form Error:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            <SEO 
                title="Contact — BASE"
                description="Have questions about sizing, an order, or collaborations? Get in touch with Base."
                keywords="contact base products, base support, base customer care"
                canonicalUrl="https://baseproducts.online/contact"
            />
            <Navbar />

            {/* Header */}
            <div className="container mx-auto px-6 lg:px-8 pt-16 pb-12 max-w-6xl">
                <h1 className="text-[32px] md:text-[48px] font-medium text-[#1A1A1A] tracking-tight mb-4">Get in touch.</h1>
                <p className="text-[14px] md:text-[16px] text-[#8A8A8A] max-w-xl leading-relaxed">
                    Have questions about sizing, your order, or collaborations? We're here to help. Our team typically responds within 24–48 business hours.
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 container mx-auto px-6 lg:px-8 pb-24 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E8E5E0]">
                    
                    {/* Contact Info (Black Box) */}
                    <div className="lg:col-span-5 order-2 lg:order-1 bg-[#1A1A1A] text-white p-10 md:p-14 flex flex-col justify-between">
                        <div>
                            <h2 className="text-[24px] font-medium tracking-tight mb-10">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Email</p>
                                    <a href="mailto:basecustomer2018@gmail.com" className="text-[14px] md:text-[15px] font-light hover:text-white/80 transition-colors flex items-center gap-3">
                                        <Mail size={16} className="text-white/50" /> basecustomer2018@gmail.com
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Phone</p>
                                    <a href="tel:+14242063358" className="text-[14px] md:text-[15px] font-light hover:text-white/80 transition-colors flex items-center gap-3">
                                        <Phone size={16} className="text-white/50" /> +1 (424) 206-3358
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Location</p>
                                    <p className="text-[14px] md:text-[15px] font-light flex items-center gap-3">
                                        <MapPin size={16} className="text-white/50" /> Torrance, California
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 pt-8 border-t border-white/10">
                            <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold mb-2">Response Time</p>
                            <p className="text-[13px] text-white/70 leading-relaxed font-light">
                                Mon–Fri, 9am–5pm PST.
                            </p>
                        </div>
                    </div>

                    {/* Form (White Box) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 bg-white p-10 md:p-14">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-12 text-center h-full"
                                >
                                    <CheckCircle2 size={32} className="text-emerald-500 mb-5" />
                                    <h3 className="text-[18px] font-medium text-[#1A1A1A] mb-2">Message sent</h3>
                                    <p className="text-[14px] text-[#8A8A8A] max-w-xs leading-relaxed">
                                        We've received your message and will get back to you shortly.
                                    </p>
                                </motion.div>
                            ) : !user ? (
                                <motion.div 
                                    key="locked"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-10 text-center h-full"
                                >
                                    <MessageSquare size={28} className="text-[#D5D0CA] mb-5" />
                                    <h3 className="text-[18px] font-medium text-[#1A1A1A] mb-2">Sign in to contact us</h3>
                                    <p className="text-[14px] text-[#8A8A8A] max-w-xs mb-8 leading-relaxed">
                                        You need a registered account to send a message to our team.
                                    </p>
                                    <Link 
                                        to="/auth" 
                                        className="bg-[#1A1A1A] hover:bg-[#333] text-white px-8 py-3.5 text-[13px] font-medium transition-colors w-full sm:w-auto text-center"
                                    >
                                        Sign in
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit} 
                                    className="space-y-6"
                                >
                                    <h3 className="text-[20px] font-medium text-[#1A1A1A] mb-4">Send a message</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">Name</label>
                                            <input 
                                                type="text" name="name" value={formData.name} onChange={handleChange} required
                                                className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3.5 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">Email</label>
                                            <input 
                                                type="email" name="email" value={formData.email} disabled required
                                                className="w-full bg-[#F5F3F0] border border-[#E8E5E0] px-4 py-3.5 text-[13px] text-[#8A8A8A] cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">Phone</label>
                                        <input 
                                            type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                            className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3.5 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors"
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">Message</label>
                                        <textarea 
                                            name="message" value={formData.message} onChange={handleChange} required rows={5}
                                            className="w-full bg-[#FAF9F7] border border-[#E8E5E0] p-4 text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                                            placeholder="How can we help?"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" disabled={isSubmitting}
                                        className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Send message <Send size={14} /></>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default ContactUs;
