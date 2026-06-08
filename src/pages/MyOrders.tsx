import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL, authHeaders } from "@/lib/utils";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color?: string;
    variantInfo?: string;
    image: string;
}

interface Order {
    id: string;
    total: number;
    status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    statusMessage?: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
}

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/orders/user`, {
                headers: {
                    ...authHeaders()
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            toast.error("An error occurred while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-yellow-500" />;
            case 'processing': return <Package size={16} className="text-blue-500" />;
            case 'shipped': return <Truck size={16} className="text-purple-500" />;
            case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
            default: return <Clock size={16} className="text-muted-foreground" />;
        }
    };

    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary/30">
            <Navbar />
            
            <main className="container mx-auto px-6 pt-10 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-[#1A1A1A] flex items-center justify-center shrink-0">
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-[28px] md:text-[36px] font-medium tracking-tight text-[#1A1A1A]">Your Orders</h1>
                            <p className="text-[13px] text-[#8A8A8A] mt-1">Track and manage your purchases</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-8 h-8 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                            <p className="text-[12px] text-[#8A8A8A] font-medium">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white border border-[#E8E5E0] p-20 text-center"
                        >
                            <ShoppingBag size={40} className="mx-auto mb-5 text-[#D5D0CA] stroke-1" />
                            <h2 className="text-[18px] font-medium text-[#1A1A1A] mb-2">No orders found</h2>
                            <p className="text-[13px] text-[#8A8A8A] max-w-xs mx-auto mb-8 leading-relaxed">
                                You haven't made any purchases yet. Check out our latest collection!
                            </p>
                            <Link 
                                to="/shop" 
                                className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-3 text-[13px] font-medium transition-colors"
                            >
                                Start Shopping <ChevronRight size={14} />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border border-[#E8E5E0]"
                                >
                                    {/* Order Header */}
                                    <div className="p-5 border-b border-[#E8E5E0] bg-[#FAF9F7] flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-8">
                                            <div>
                                                <p className="text-[11px] text-[#8A8A8A] mb-1">Order ID</p>
                                                <p className="text-[13px] font-medium text-[#1A1A1A]">#{order.id.split('-')[0]}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-[#8A8A8A] mb-1">Date</p>
                                                <p className="text-[13px] font-medium text-[#1A1A1A]">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-[#8A8A8A] mb-1">Total</p>
                                                <p className="text-[13px] font-medium text-[#1A1A1A]">${order.total}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-[#8A8A8A] mb-1">Payment</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[13px] font-medium text-[#1A1A1A]">Stripe</p>
                                                    <span className={`text-[10px] px-2 py-0.5 border ${
                                                        order.paymentStatus === 'paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                                                    }`}>
                                                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white border border-[#E8E5E0] px-3 py-1.5">
                                            {getStatusIcon(order.status)}
                                            <span className="text-[11px] font-medium text-[#1A1A1A] capitalize">{order.status}</span>
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    {order.statusMessage && (
                                        <div className="px-5 py-4 bg-[#FAF9F7] border-b border-[#E8E5E0] flex items-start gap-3">
                                            <MessageSquare size={16} className="text-[#8A8A8A] shrink-0" />
                                            <div>
                                                <p className="text-[11px] text-[#8A8A8A] mb-1">Admin Update</p>
                                                <p className="text-[13px] text-[#1A1A1A] font-medium leading-relaxed">{order.statusMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {order.items.map((item) => {
                                                let customFieldsData: Record<string, string> = {};
                                                try {
                                                    customFieldsData = item.variantInfo ? JSON.parse(item.variantInfo) : {};
                                                } catch (e) {
                                                    // ignore parse errors
                                                }

                                                return (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <div className="w-16 h-20 bg-[#F0EDE8] overflow-hidden border border-[#E8E5E0] shrink-0">
                                                            <img 
                                                                src={item.image || "/placeholder.jpg"} 
                                                                alt={item.name} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                            <div>
                                                                <h3 className="text-[13px] font-medium text-[#1A1A1A] mb-1.5">{item.name}</h3>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-[11px] text-[#8A8A8A] border border-[#E8E5E0] px-2 py-0.5">
                                                                        Size: {item.size}
                                                                    </span>
                                                                    {item.color && (
                                                                        <span className="text-[11px] text-[#8A8A8A] border border-[#E8E5E0] px-2 py-0.5">
                                                                            Color: {item.color}
                                                                        </span>
                                                                    )}
                                                                    {Object.entries(customFieldsData).map(([key, value]) => (
                                                                        <span key={key} className="text-[11px] text-[#8A8A8A] border border-[#E8E5E0] px-2 py-0.5">
                                                                            {key}: {value}
                                                                        </span>
                                                                    ))}
                                                                    <span className="text-[11px] text-[#1A1A1A] bg-[#FAF9F7] border border-[#E8E5E0] px-2 py-0.5">
                                                                        Qty: {item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-[14px] font-medium text-[#1A1A1A]">${item.price * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
            <FooterSection />
        </div>
    );
};

export default MyOrders;
