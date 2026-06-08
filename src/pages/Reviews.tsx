import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  location: string;
  message: string;
  createdAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ name: "", location: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message || !formData.location) {
      toast.error("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Review submitted successfully.");
        setFormData({ name: "", location: "", message: "" });
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-[#E8E5E0] py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase inline-block">
            Our Community
          </span>
          <h1 className="text-[32px] md:text-[42px] font-medium text-[#1A1A1A] tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-[14px] text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
            Read what our community has to say about our premium faith-driven apparel.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6 flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Reviews Grid */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 border border-[#E8E5E0] bg-white text-[#8A8A8A] text-[14px]">
                  No reviews available yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white border border-[#E8E5E0] p-6 sm:p-8 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex gap-0.5 mb-4">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={12} className="fill-[#1A1A1A] text-[#1A1A1A]" />
                          ))}
                        </div>
                        <p className="text-[14px] text-[#4A4A4A] leading-relaxed mb-6 whitespace-pre-wrap">
                          "{review.message}"
                        </p>
                      </div>
                      <div className="border-t border-[#E8E5E0] pt-6 flex items-center gap-3 mt-auto">
                        <div className="w-10 h-10 bg-[#FAF9F7] text-[#1A1A1A] font-medium text-[13px] flex items-center justify-center flex-shrink-0 border border-[#E8E5E0]">
                          {review.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-medium text-[#1A1A1A] truncate">
                              {review.name}
                            </p>
                            <CheckCircle size={14} className="text-[#1A1A1A]" aria-label="Verified Purchase" />
                          </div>
                          <p className="text-[11px] text-[#8A8A8A] truncate">
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Divider */}
            <div className="lg:hidden w-full h-px bg-[#E8E5E0]" />

            {/* Leave a Review Form */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white border border-[#E8E5E0] p-6 md:p-8">
                <h3 className="text-[18px] font-medium text-[#1A1A1A] mb-2">Leave a Review</h3>
                <p className="text-[13px] text-[#6B6B6B] mb-6">
                  Share your experience with Base. Your review will be submitted for approval.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#8A8A8A] uppercase mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8A8A8A] uppercase mb-1.5">Location</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8A8A8A] uppercase mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF9F7] border border-[#E8E5E0] px-4 py-3 text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                      placeholder="What did you think of our apparel?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1A1A1A] text-white py-3.5 text-[13px] font-medium hover:bg-[#333] transition-colors disabled:bg-[#8A8A8A]"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Reviews;
