import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL, authHeaders } from "@/lib/utils";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

interface Order {
    id: string;
    total: number;
    status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
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
            
            <main className="container mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-full gradient-btn flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Your Orders</h1>
                            <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Track and manage your purchases</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Loading order history...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-muted/30 border border-dashed border-border rounded-lg p-20 text-center"
                        >
                            <ShoppingBag size={48} className="mx-auto mb-6 text-muted-foreground/30 stroke-1" />
                            <h2 className="text-lg font-black uppercase tracking-tight mb-2">No orders found yet</h2>
                            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-8 font-bold leading-relaxed">
                                Looks like you haven't made any purchases with us. Check out our latest collection!
                            </p>
                            <Link 
                                to="/shop" 
                                className="inline-flex items-center gap-2 gradient-btn px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
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
                                    className="bg-background border border-border/60 rounded-sm overflow-hidden group hover:border-primary/50 transition-colors shadow-sm"
                                >
                                    {/* Order Header */}
                                    <div className="p-5 border-b border-border/40 bg-muted/20 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Order ID</p>
                                                <p className="text-[10px] font-mono font-black truncate max-w-[120px] uppercase">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Date</p>
                                                <p className="text-[10px] font-bold">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Total</p>
                                                <p className="text-[10px] font-black text-primary">${order.total}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Payment</p>
                                                <p className="text-[10px] font-bold uppercase">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full">
                                            {getStatusIcon(order.status)}
                                            <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="w-16 h-20 rounded bg-muted overflow-hidden border border-border/40 shrink-0">
                                                        <img 
                                                            src={item.image || "/placeholder.jpg"} 
                                                            alt={item.name} 
                                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-xs font-black uppercase tracking-tight mb-1">{item.name}</h3>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">Size: {item.size}</span>
                                                                <span className="text-[9px] font-bold text-muted-foreground">Qty: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs font-black">${item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default MyOrders;
