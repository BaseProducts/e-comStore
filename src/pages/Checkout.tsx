import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Truck, 
  Lock,
  Zap
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { BASE_URL, authHeaders } from "@/lib/utils";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, totalPrice, isLoading } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State — shipping details only, payment is always Stripe
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
    });

    const subtotal = totalPrice;
    const grandTotal = subtotal;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to access checkout");
            navigate("/auth");
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);
        
        try {
            // Create a Stripe Checkout Session on the backend
            const response = await fetch(`${BASE_URL}/api/stripe/create-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.url) {
                // Redirect to Stripe Checkout page
                window.location.href = result.url;
            } else {
                toast.error(result.error || result.message || "Failed to initiate payment");
            }
        } catch (error) {
            toast.error("Connection error. Please try again.");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Navbar />
            
            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/shop" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                        Secure <span className="text-primary">Checkout</span>
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="text-primary">01 Address</span>
                        <ChevronRight size={14} />
                        <span>02 Payment</span>
                        <ChevronRight size={14} />
                        <span>03 Confirm</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">1</div>
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                    Shipping Details <MapPin size={20} className="text-primary" />
                                </h2>
                            </div>
                            
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" id="checkout-form" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Full Name</label>
                                    <input 
                                        required
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email Address</label>
                                    <input 
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Phone Number</label>
                                    <input 
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Shipping Address</label>
                                    <input 
                                        required
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Street Name"
                                        className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">City</label>
                                    <input 
                                        required
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">State</label>
                                        <input 
                                            required
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="NY"
                                            className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Zip Code</label>
                                        <input 
                                            required
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="10001"
                                            className="w-full bg-muted/30 border border-border focus:border-primary outline-none px-4 py-3 rounded-sm transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        {/* Payment Method — Stripe Only badge */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">2</div>
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                    Payment Method <CreditCard size={20} className="text-primary" />
                                </h2>
                            </div>
                            
                            <div className="p-6 rounded-sm border-2 border-primary bg-primary/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                            <CreditCard size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-wider">Stripe Secure Checkout</p>
                                            <p className="text-[10px] text-muted-foreground font-bold tracking-wide">
                                                Credit/Debit Cards • Apple Pay • Google Pay
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Secured</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1">
                                        <Lock size={10} /> End-to-End Encrypted
                                    </div>
                                    <span className="text-border">|</span>
                                    <div className="flex items-center gap-1">
                                        <Zap size={10} /> Instant Confirmation
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8 bg-muted/20 border border-border p-8 rounded-sm">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Order Summary</h2>
                            
                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                                            <img 
                                                src={item.product.imageUrls?.[0] || "/placeholder.jpg"} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-black uppercase tracking-tight line-clamp-1">{item.product.name}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                                                Qty: {item.quantity} | Size: {item.size}
                                            </p>
                                            <p className="text-xs font-bold mt-1">${(item.product.discountPrice || item.product.price) * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                {cartItems.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-border space-y-4">
                                <div className="flex justify-between text-xl font-black tracking-tighter uppercase pt-4 border-t border-border border-dashed">
                                    <span>Total</span>
                                    <span className="text-primary">${grandTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <button 
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing || cartItems.length === 0}
                                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-[0.2em] rounded-sm hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden relative group shadow-lg shadow-indigo-500/20"
                            >
                                <AnimatePresence mode="wait">
                                    {isProcessing ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -20 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Redirecting to Stripe...
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="static"
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -20 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CreditCard size={18} />
                                            Pay with Stripe
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1">
                                    <Lock size={10} /> Secure SSL
                                </div>
                                <div className="flex items-center gap-1">
                                    <Truck size={10} /> Fast Delivery
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={10} /> Stripe Protected
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
