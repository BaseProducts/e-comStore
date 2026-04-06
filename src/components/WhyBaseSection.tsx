import { motion } from "framer-motion";
import { Cross, Gem, Flame } from "lucide-react";

const pillars = [
  {
    icon: Cross,
    title: "Faith-Driven Identity",
    desc: "Every piece is rooted in purpose. Wear what you believe.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    desc: "Heavyweight fabrics, precision prints. Built to last.",
  },
  {
    icon: Flame,
    title: "Bold Expression",
    desc: "Designed to start conversations and stand out.",
  },
];

const WhyBaseSection = () => {
  return (
    <section className="py-24 md:py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm tracking-[0.3em] uppercase text-muted-foreground text-center mb-16"
        >
          Why Base
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-4xl mx-auto">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-6">
                <p.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-base font-bold tracking-wide mb-3 text-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBaseSection;
