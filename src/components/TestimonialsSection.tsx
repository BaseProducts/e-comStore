import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";

const reviews = [
  {
    text: "This isn't just clothing — it starts conversations. I wore it to a local coffee shop and ended up having a 20-minute talk about faith with a complete stranger.",
    author: "Marcus T.",
    location: "Los Angeles, CA",
    initials: "MT",
  },
  {
    text: "The quality is insane. I've never felt fabric this thick and premium on a faith brand. It fits exactly how I wanted: boxy, heavy, and extremely comfortable.",
    author: "Jasmine R.",
    location: "Atlanta, GA",
    initials: "JR",
  },
  {
    text: "Finally, a streetwear brand that represents who I am without compromising on the aesthetic. It feels premium and minimalist. 10/10 will buy again.",
    author: "David K.",
    location: "Houston, TX",
    initials: "DK",
  },
  {
    text: "Super fast shipping, packaging was beautiful, and the print quality is incredibly durable. Has survived multiple hot washes perfectly without cracking.",
    author: "Sarah L.",
    location: "Chicago, IL",
    initials: "SL",
  },
];

const TestimonialsSection = () => {
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
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
            Our Community
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900">
            The Voice of Base
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Read stories from believers around the world sharing their faith through premium streetwear.
          </p>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-zinc-150/80 hover:border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Rating */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className="fill-orange-500 text-orange-500"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed italic mb-6">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="border-t border-zinc-100 pt-4 flex items-center gap-3">
                {/* Avatar Initials */}
                <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  {review.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {review.author}
                    </p>
                    <CheckCircle size={12} className="text-emerald-500 fill-emerald-50" title="Verified Purchase" />
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
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
