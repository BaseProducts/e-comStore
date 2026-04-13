import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Package
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { BASE_URL, authHeaders } from "@/lib/utils";

interface VerifiedOrder {
  id: string;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }>;
}

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [status, setStatus] = useState<"verifying" | "success" | "timeout">("verifying");
  const [order, setOrder] = useState<VerifiedOrder | null>(null);
  const attemptsRef = useRef(0);
  const maxAttempts = 15;
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("timeout");
      return;
    }

    const pollForOrder = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/orders/verify-session?session_id=${sessionId}`,
          {
            headers: { ...authHeaders() },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.status === "success" && data.order) {
            setOrder(data.order);
            setStatus("success");

            // Clear cart state in frontend (backend already cleared it via webhook)
            if (!hasCleared.current) {
              clearCart();
              hasCleared.current = true;
            }
            return; // Stop polling
          }
        }

        // Order not found yet — keep polling
        attemptsRef.current += 1;
        if (attemptsRef.current >= maxAttempts) {
          setStatus("timeout");
        } else {
          setTimeout(pollForOrder, 2000);
        }
      } catch {
        attemptsRef.current += 1;
        if (attemptsRef.current >= maxAttempts) {
          setStatus("timeout");
        } else {
          setTimeout(pollForOrder, 2000);
        }
      }
    };

    pollForOrder();
  }, [sessionId]);

  // Verifying state
  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto">
              <Loader2 size={40} className="text-indigo-500 animate-spin" />
            </div>
            <motion.div
              className="absolute inset-0 w-24 h-24 rounded-full border-2 border-indigo-500/20 mx-auto"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-3">
              Confirming Payment
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              We're verifying your payment with Stripe. This usually takes just a few seconds...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            <ShieldCheck size={14} />
            Secure Verification in Progress
          </div>
        </motion.div>
      </div>
    );
  }

  // Timeout / Error state
  if (status === "timeout") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={40} className="text-amber-500" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Payment <span className="text-amber-500">Processing</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Your payment was received but order confirmation is taking longer than expected. 
            Don't worry — your order will appear in{" "}
            <Link to="/orders" className="text-primary underline font-bold">My Orders</Link>{" "}
            once it's fully processed.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            No duplicate charges will occur
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all active:scale-95"
            >
              <Package size={16} />
              Check My Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-border px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-muted transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={48} className="text-emerald-500" />
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black uppercase tracking-tighter mb-3"
          >
            Payment <span className="text-emerald-500">Confirmed!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed"
          >
            Your payment has been successfully processed. Your order is now being prepared.
          </motion.p>
        </div>

        {/* Order summary */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-muted/20 border border-border rounded-sm p-6 text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Order ID
              </span>
              <span className="text-[10px] font-mono font-black uppercase">
                #{order.id.split("-")[0]}
              </span>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-tight truncate">
                      {item.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">
                      Qty: {item.quantity} • Size: {item.size}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dashed border-border">
              <span className="text-xs font-black uppercase tracking-tighter">Total Paid</span>
              <span className="text-lg font-black text-emerald-500">${order.total}</span>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-2 rounded-full w-fit">
              <ShieldCheck size={12} />
              Payment Verified via Stripe
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all active:scale-95"
          >
            <ShoppingBag size={16} />
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-border px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-muted transition-all"
          >
            Continue Shopping
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
