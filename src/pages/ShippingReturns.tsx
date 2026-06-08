import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { motion } from "framer-motion";
import { Truck, RotateCcw, AlertCircle, HelpCircle } from "lucide-react";

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-zinc-50 border-b border-border py-12 md:py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase">
            Customer Care
          </span>
          <h1 className="text-[28px] md:text-[36px] font-medium tracking-tight text-[#1A1A1A]">
            Shipping & Returns
          </h1>
          <p className="text-[13px] text-[#8A8A8A] max-w-md mx-auto">
            Everything you need to know about our shipping rates, delivery times, and returns policy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Shipping Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-[#E8E5E0] p-6 sm:p-8"
            >
              <div className="w-10 h-10 bg-[#FAF9F7] border border-[#E8E5E0] flex items-center justify-center mb-6">
                <Truck className="text-[#1A1A1A]" size={20} />
              </div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] mb-4">
                Shipping Information
              </h2>
              <ul className="space-y-4 text-[13px] text-[#6B6B6B] leading-relaxed">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">Processing Time</span>
                    Orders are processed and dispatched within 24–48 hours (excluding weekends).
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">Standard Shipping</span>
                    Delivery takes 3–5 business days depending on your location.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">Tracking Details</span>
                    A tracking link is automatically emailed as soon as your label is printed.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Returns Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-[#E8E5E0] p-6 sm:p-8"
            >
              <div className="w-10 h-10 bg-[#FAF9F7] border border-[#E8E5E0] flex items-center justify-center mb-6">
                <RotateCcw className="text-[#1A1A1A]" size={20} />
              </div>
              <h2 className="text-[15px] font-medium text-[#1A1A1A] mb-4">
                Returns & Exchanges
              </h2>
              <ul className="space-y-4 text-[13px] text-[#6B6B6B] leading-relaxed">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">14-Day Window</span>
                    We accept returns and size exchanges within 14 days from delivery.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">Original Condition</span>
                    Garments must be unworn, unwashed, and retain all original tagging.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#1A1A1A] block">Easy Process</span>
                    Email us at <strong className="text-[#1A1A1A] font-medium">basecustomer2018@gmail.com</strong> with your order ID to initiate a request.
                  </div>
                </li>
              </ul>
            </motion.div>

          </div>

          {/* Info Notice Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-[#FAF9F7] border border-[#E8E5E0] p-5 sm:p-6 flex gap-3 sm:gap-4 items-start"
          >
            <AlertCircle size={20} className="text-[#1A1A1A] mt-0.5 flex-shrink-0" />
            <div className="text-[13px] text-[#4A4A4A] leading-relaxed">
              <strong className="text-[#1A1A1A] font-medium block mb-1">Important Exchange Policy Notice</strong>
              Because we print in limited streetwear drops, sizes sell out rapidly. We highly recommend checking our size chart prior to checkout to ensure you get your desired fit.
            </div>
          </motion.div>

          {/* FAQ Accordion Section */}
          <div className="mt-20 space-y-8">
            <h2 className="text-[18px] font-medium text-[#1A1A1A] text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 border border-[#E8E5E0] bg-white p-6">
                <h4 className="font-medium text-[14px] text-[#1A1A1A] flex gap-2 items-center">
                  <HelpCircle size={16} className="text-[#8A8A8A]" />
                  Can I cancel my order?
                </h4>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed pt-2">
                  Orders can be cancelled or edited within 1 hour of purchase by contacting customer support. Once processed, we are unable to make modifications.
                </p>
              </div>
              <div className="space-y-2 border border-[#E8E5E0] bg-white p-6">
                <h4 className="font-medium text-[14px] text-[#1A1A1A] flex gap-2 items-center">
                  <HelpCircle size={16} className="text-[#8A8A8A]" />
                  Do you ship internationally?
                </h4>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed pt-2">
                  Currently, we ship domestic orders only. We are planning to expand international delivery options later this year.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ShippingReturns;
