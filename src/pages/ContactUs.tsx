import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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
        <div className="min-h-screen bg-background font-mono selection:bg-primary/30">
            <Navbar />

            <div className="pt-32 pb-20 md:pt-40 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Get In Touch</p>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Contact <span className="gradient-text">Base</span></h1>
                        <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                            Have questions about our mission, sizing, or an existing order? Drop us a message below and our team will get back to you.
                        </p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        {/* Contact Information */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-1/3 space-y-10"
                        >
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-6">Contact Info</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-muted/30 rounded flex items-center justify-center shrink-0 border border-border">
                                            <Mail size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                                            <a href="mailto:basecustomer2018@gmail.com" className="hover:text-primary transition-colors">basecustomer2018@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-muted/30 rounded flex items-center justify-center shrink-0 border border-border">
                                            <Phone size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Phone</p>
                                            <a href="tel:+14242063358" className="hover:text-primary transition-colors">(424) 206-3358</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-muted/30 rounded flex items-center justify-center shrink-0 border border-border">
                                            <MapPin size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Location</p>
                                            <p>Torrance, CA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-muted/10 border border-border rounded-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                                <h4 className="font-bold uppercase tracking-widest mb-3 relative z-10">Customer Support</h4>
                                <p className="text-sm text-muted-foreground mb-4 relative z-10">Our typical response time is within 24-48 business hours.</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary relative z-10">Mon - Fri, 9am - 5pm PST</p>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:w-2/3"
                        >
                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center bg-muted/10 border border-border rounded-sm p-12 text-center"
                                    >
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 size={32} className="text-emerald-500" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-widest mb-3">Message Received</h3>
                                        <p className="text-muted-foreground">Thank you for reaching out to Base. We have securely received your message and will be in touch shortly.</p>
                                    </motion.div>
                                ) : !user ? (
                                    <motion.div 
                                        key="locked"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center bg-muted/10 border border-border rounded-sm p-12 text-center"
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                            <Send size={32} className="text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-widest mb-3">Members Only</h3>
                                        <p className="text-muted-foreground mb-8 max-w-sm">You must have a verified account to contact support and open tickets.</p>
                                        <Link to="/auth" className="gradient-btn font-bold tracking-[0.2em] uppercase py-4 px-10 rounded-sm inline-flex items-center justify-center gap-3">
                                            Login / Sign Up
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
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Name <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    disabled
                                                    required
                                                    className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary transition-colors cursor-not-allowed opacity-70"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone Number <span className="text-red-500">*</span></label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                required
                                                onChange={handleChange}
                                                className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                                placeholder="(123) 456-7890"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Message <span className="text-red-500">*</span></label>
                                            <textarea 
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                                                placeholder="How can we help you today?"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full gradient-btn font-bold tracking-[0.2em] uppercase py-4 rounded-sm flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send size={16} />
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
