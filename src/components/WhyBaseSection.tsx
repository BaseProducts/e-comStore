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
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Our Foundation
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-900 leading-none">
                Why <span className="text-orange-600">Base</span>?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed pt-2">
                We are a pastoral family honored to serve the Lord by shepherding the Church of Los Angeles, California. God has entrusted us with the mission of helping build a strong Christian identity — encouraging people to live according to the values of the Gospel in every area of life.
              </p>
            </motion.div>

            {/* Premium CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg group"
            >
              {/* Background gradient glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl group-hover:bg-orange-600/35 transition-colors duration-500" />
              
              <h4 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-2">
                Our Mission
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed mb-5">
                To glorify God, serve people, and expand His Kingdom through everything He has entrusted into our hands.
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-orange-400 transition-colors"
              >
                Explore The Collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column - 6 Points Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 p-3 sm:p-5 bg-white border border-zinc-100 rounded-xl hover:border-orange-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <item.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-orange-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[10px] sm:text-sm font-black text-zinc-800 group-hover:text-zinc-950 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-zinc-500 leading-normal sm:leading-relaxed font-semibold">
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
