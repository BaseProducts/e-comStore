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
  CheckCircle2,
  Lock
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { BASE_URL, authHeaders } from "@/lib/utils";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, totalPrice, isLoading, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        paymentMethod: "cod"
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
            const response = await fetch(`${BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({
                    ...formData,
                    subtotal,
                    tax: 0,
                    shipping: 0,
                    total: grandTotal
                })
            });

            const result = await response.json();

            if (response.ok) {
                setOrderSuccess(true);
                toast.success("Order placed successfully!");
                clearCart();
            } else {
                toast.error(result.message || "Failed to place order");
            }
        } catch (error) {
            toast.error("Connection error. Please try again.");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle2 size={48} className="text-primary" />
                </motion.div>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Order Confirmed!</h1>
                <p className="text-muted-foreground max-w-md mb-10">
                    Thank you for your purchase. We've sent a confirmation email to {formData.email || "your address"}. Your order is being processed.
                </p>
                <Link 
                    to="/"
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

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
                        <span>03 Review</span>
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

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">2</div>
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                    Payment Method <CreditCard size={20} className="text-primary" />
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["cod"/*, "stripe"*/].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                                        className={`p-6 rounded-sm border-2 transition-all text-left space-y-2 group ${
                                            formData.paymentMethod === method 
                                            ? "border-primary bg-primary/5" 
                                            : "border-border bg-muted/20 hover:border-border/80"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            formData.paymentMethod === method ? "border-primary" : "border-muted-foreground"
                                        }`}>
                                            {formData.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {method === "cod" ? "Cash On Delivery" : "Stripe Checkout"}
                                        </p>
                                    </button>
                                ))}
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
                                className="w-full py-5 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] rounded-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden relative group"
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
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            Processing...
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="static"
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -20 }}
                                            className="flex items-center gap-2"
                                        >
                                            <ShieldCheck size={18} />
                                            Proceed to Buy
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
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
