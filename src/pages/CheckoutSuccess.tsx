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
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
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

        const data = await res.json();
        
        if (res.ok && data.status === "success" && data.order) {
          setOrder(data.order);
          setStatus("success");

          // Clear cart state in frontend (backend already cleared it via webhook)
          if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
          }
          return; // Stop polling successfully
        }

        // If explicitly pending or any other 200 response without order
        if (data.status === "pending") {
          console.log(`[Polling] Order still pending (Attempt ${attemptsRef.current + 1}/${maxAttempts})`);
        }

        // Keep polling
        attemptsRef.current += 1;
        if (attemptsRef.current >= maxAttempts) {
          setStatus("timeout");
        } else {
          setTimeout(pollForOrder, 3000); // 3 second delay between polls
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
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 py-20 text-center">
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
        <FooterSection />
      </div>
    );
  }

  // Timeout / Error state
  if (status === "timeout") {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-[#FAF9F7] border border-[#E8E5E0] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={24} className="text-[#8A8A8A]" />
            </div>
            <h1 className="text-[28px] font-medium tracking-tight text-[#1A1A1A]">
              Payment <span className="text-[#8A8A8A]">Processing</span>
            </h1>
            <p className="text-[#6B6B6B] max-w-md mx-auto text-[14px] leading-relaxed">
              Your payment was received but order confirmation is taking longer than expected. 
              Don't worry — your order will appear in{" "}
              <Link to="/orders" className="text-[#1A1A1A] underline font-medium">My Orders</Link>{" "}
              once it's fully processed.
            </p>
            <p className="text-[12px] text-[#8A8A8A]">
              No duplicate charges will occur
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3.5 text-[13px] font-medium hover:bg-[#333] transition-colors"
              >
                <Package size={14} />
                Check my orders
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-[#E8E5E0] px-6 py-3.5 text-[13px] font-medium hover:bg-[#FAF9F7] transition-colors text-[#1A1A1A]"
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        </div>
        <FooterSection />
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 bg-[#FAF9F7] border border-[#E8E5E0] flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={24} className="text-emerald-500" />
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[28px] font-medium tracking-tight text-[#1A1A1A] mb-3"
            >
              Payment Confirmed
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#6B6B6B] max-w-md mx-auto text-[14px] leading-relaxed"
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
              className="bg-white border border-[#E8E5E0] p-6 text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8A8A8A]">
                  Order ID
                </span>
                <span className="text-[13px] font-medium text-[#1A1A1A]">
                  #{order.id.split("-")[0]}
                </span>
              </div>

              <div className="space-y-3 border-t border-[#E8E5E0] pt-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-[#F0EDE8] overflow-hidden flex-shrink-0 border border-[#E8E5E0]">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1A1A1A] truncate mb-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#8A8A8A]">
                        Qty: {item.quantity} • Size: {item.size}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium text-[#1A1A1A]">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E5E0]">
                <span className="text-[13px] font-medium text-[#1A1A1A]">Total paid</span>
                <span className="text-[16px] font-medium text-[#1A1A1A]">${order.total}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-600 bg-emerald-50 px-3 py-2 border border-emerald-100 w-fit">
                <ShieldCheck size={12} />
                Payment verified via Stripe
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
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3.5 text-[13px] font-medium hover:bg-[#333] transition-colors"
            >
              <ShoppingBag size={14} />
              View my orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-[#E8E5E0] px-6 py-3.5 text-[13px] font-medium hover:bg-[#FAF9F7] transition-colors text-[#1A1A1A]"
            >
              Continue shopping
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default CheckoutSuccess;
