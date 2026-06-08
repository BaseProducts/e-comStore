import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { BASE_URL } from "@/lib/utils";

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.data.slice(0, 4)); // Only show top 4 on homepage
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-zinc-50/30">
      <div className="container mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase inline-block">
            Our Community
          </span>
          <h2 className="text-[28px] md:text-[36px] font-medium text-[#1A1A1A] tracking-tight">
            The Voice of Base
          </h2>
          <p className="text-[13px] text-[#8A8A8A] max-w-md mx-auto">
            Hear from people who wear their faith boldly and carry a message of purpose through Base.
          </p>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-[#E8E5E0] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className="fill-[#1A1A1A] text-[#1A1A1A]"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-[13px] text-[#4A4A4A] leading-relaxed mb-6">
                  "{review.message}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="border-t border-[#E8E5E0] pt-6 flex items-center gap-3 mt-auto">
                {/* Avatar Initials */}
                <div className="w-10 h-10 bg-[#FAF9F7] text-[#1A1A1A] font-medium text-[13px] flex items-center justify-center flex-shrink-0 border border-[#E8E5E0]">
                  {review.name ? review.name.substring(0, 2).toUpperCase() : "AA"}
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
