import { motion } from "framer-motion";
import { Cross, Gem, Leaf, MessageSquare, Gift, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: Cross,
    title: "Faith-First Identity",
    desc: "Every design tells a story of faith, designed to spark meaningful spiritual conversations.",
  },
  {
    icon: Gem,
    title: "Premium Heavyweight Fabric",
    desc: "We source custom, premium-grade cotton blends for maximum durability, fit, and everyday comfort.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    desc: "Our materials are sourced using fair labor standards and printed with eco-friendly ink processes.",
  },
  {
    icon: MessageSquare,
    title: "Minimal Design, Max Message",
    desc: "Striking the perfect balance between clean contemporary streetwear aesthetics and profound spiritual truth.",
  },
  {
    icon: Gift,
    title: "Direct Impact",
    desc: "A portion of every purchase is donated directly to supporting local community outreach and global evangelism.",
  },
  {
    icon: Users,
    title: "Community Focused",
    desc: "Join a global family of believers bold enough to share their testimony through premium streetwear.",
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
                We believe clothing is more than just fabric—it's a canvas for your testimony. We create premium streetwear that makes sharing your faith natural, beautiful, and bold.
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
                The Base Standard
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed mb-5">
                Each product is designed, inspected, and shipped with care from our central workshop to ensure you receive nothing but the best.
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
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <item.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-orange-600 group-hover:text-white transition-colors" />
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
