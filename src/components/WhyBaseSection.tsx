import { motion } from "framer-motion";
import { Cross, Gem, Leaf, MessageSquare, Gift, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: Cross,
    title: "Founded on God's Word",
    desc: "Every design is rooted in the principles of Scripture, with Christ at the center of everything we create.",
  },
  {
    icon: Gem,
    title: "Excellence & Quality",
    desc: "We honor God through excellence — premium fabrics, meticulous craftsmanship, and designs built to last.",
  },
  {
    icon: Leaf,
    title: "Strengthening Identity",
    desc: "Our mission is to help build a strong Christian identity, encouraging men, women, and families to live out the Gospel.",
  },
  {
    icon: MessageSquare,
    title: "Apparel That Speaks",
    desc: "Every garment is a tool for sharing faith, opening doors for conversations about Jesus wherever you go.",
  },
  {
    icon: Gift,
    title: "Purpose in Every Piece",
    desc: "We don't just sell apparel. We carry a message, wear a purpose, and proclaim a Kingdom with every product.",
  },
  {
    icon: Users,
    title: "Pastoral Heart",
    desc: "Born from a pastoral family shepherding the Church in Los Angeles, our calling extends beyond the pulpit into everyday life.",
  },
];

const WhyBaseSection = () => {
  return (
    <section className="py-12 md:py-28 px-4 md:px-6 bg-zinc-50/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column - Core Pitch */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase">
                Our Foundation
              </span>
              <h2 className="text-[28px] md:text-[36px] font-medium text-[#1A1A1A] tracking-tight leading-tight">
                Why Base?
              </h2>
              <p className="text-[13px] text-[#6B6B6B] leading-relaxed pt-2">
                We are a pastoral family honored to serve the Lord by shepherding the Church of Los Angeles, California. God has entrusted us with the mission of helping build a strong Christian identity — encouraging people to live according to the values of the Gospel in every area of life.
              </p>
            </motion.div>

            {/* Premium CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1A1A1A] text-white p-6 md:p-8 relative overflow-hidden group"
            >
              <h4 className="text-[11px] font-medium tracking-widest text-[#D5D0CA] uppercase mb-2">
                Our Mission
              </h4>
              <p className="text-[13px] text-[#E8E5E0] leading-relaxed mb-6">
                To glorify God, serve people, and expand His Kingdom through everything He has entrusted into our hands.
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide text-white transition-colors hover:text-[#D5D0CA]"
              >
                Explore the collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column - 6 Points Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-3 md:gap-4">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 md:p-6 bg-white border border-[#E8E5E0] hover:border-[#1A1A1A] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[#FAF9F7] border border-[#E8E5E0] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-[#1A1A1A]" />
                </div>
                
                {/* Content */}
                <div className="space-y-1 md:space-y-1.5">
                  <h3 className="text-[11px] md:text-[14px] font-medium text-[#1A1A1A] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] md:text-[12px] text-[#6B6B6B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyBaseSection;
