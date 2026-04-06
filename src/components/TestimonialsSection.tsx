import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    text: "This isn't just clothing — it starts conversations.",
    author: "Marcus T.",
    location: "Los Angeles, CA",
  },
  {
    text: "The quality is insane. I've never felt fabric this good on a faith brand.",
    author: "Jasmine R.",
    location: "Atlanta, GA",
  },
  {
    text: "Finally, something I'm proud to wear that represents who I am.",
    author: "David K.",
    location: "Houston, TX",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Community
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Voices
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-sm p-8"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {review.author}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {review.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
