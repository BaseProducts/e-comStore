import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BASE_URL } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/faqs`);
        if (response.ok) {
          const data = await response.json();
          setFaqs(data.data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-white border-b border-[#E8E5E0] py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center space-y-4">
          <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase inline-block">
            Support
          </span>
          <h1 className="text-[32px] md:text-[42px] font-medium text-[#1A1A1A] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-[14px] text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
            Find answers to common questions about our products, shipping, returns, and the Base brand mission.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6 flex-grow">
        <div className="container mx-auto max-w-3xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-20 text-[#8A8A8A] text-[14px]">
              No FAQs available at the moment.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-[#E8E5E0] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors hover:bg-[#FAF9F7]"
                  >
                    <span className="text-[13px] md:text-[15px] font-medium text-[#1A1A1A]">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-[#8A8A8A] transition-transform duration-300 shrink-0 ${openId === faq.id ? "rotate-180" : ""}`} 
                    />
                  </button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-4 md:p-6 pt-0 md:pt-0 text-[12px] md:text-[14px] text-[#4A4A4A] leading-relaxed border-t border-[#E8E5E0] mt-1 pt-4 md:pt-5 whitespace-pre-wrap">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FAQ;
