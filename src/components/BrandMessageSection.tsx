import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import posterImage from "@/assets/poster.png";
import { Sparkles } from "lucide-react";
import { BASE_URL } from "@/lib/utils";

const BrandMessageSection = () => {
  const [dynamicPoster, setDynamicPoster] = useState(posterImage);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/settings`);
        const { data } = await res.json();
        if (data?.purpose_image) {
          setDynamicPoster(data.purpose_image);
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Image Card with floating elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative overflow-hidden border border-[#E8E5E0] bg-[#F0EDE8] aspect-square max-w-[500px] mx-auto">
              <img 
                src={dynamicPoster}  
                alt="Base Products — Founded on the Word" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Bottom text overlay on image */}
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[11px] font-medium tracking-wide uppercase text-white/70">
                  Est. 2018
                </span>
                <p className="text-[14px] font-medium tracking-wide mt-1">
                  Founded on the Word. Guided by Faith.
                </p>
              </div>
            </div>

            {/* Decorative float badge */}
            {/* <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 top-10 bg-white border border-zinc-150 p-4 rounded-xl shadow-lg hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkles size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Kingdom Purpose</p>
                <p className="text-[9px] text-zinc-500">More Than a Brand</p>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Right Column - Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-[11px] font-medium tracking-wide text-[#8A8A8A] uppercase">
                Our Purpose
              </span>
              <h2 className="text-[28px] md:text-[36px] font-medium text-[#1A1A1A] tracking-tight leading-tight">
                More than apparel. <br />
                <span className="text-[#8A8A8A]">We carry a message.</span>
              </h2>
              <p className="text-[13px] text-[#6B6B6B] leading-relaxed pt-2">
                We believe that clothing is more than appearance. Every garment communicates a message, reflects values, and expresses an identity. That is why we have chosen to build a brand founded on the principles of God's Word, with Christ at the center of everything we do.
              </p>
              <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
                Base exists so that every person who wears our brand carries a purpose — a tool for sharing faith, opening doors for conversations about Jesus, and reminding the world that we are called to live lives that glorify God.
              </p>
            </motion.div>

            {/* Quote Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-l-4 border-orange-500 pl-6 py-2 bg-zinc-50 rounded-r-xl"
            >
              <p className="text-xs italic text-zinc-650 leading-relaxed">
                "But as for me and my house, we will serve the Lord."
              </p>
              <p className="text-[10px] uppercase font-black text-zinc-400 mt-2 tracking-widest">
                Joshua 24:15
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandMessageSection;
