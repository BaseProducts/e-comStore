import { motion } from "framer-motion";
import posterImage from "@/assets/poster.png";
import { Sparkles } from "lucide-react";

const BrandMessageSection = () => {
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
            {/* Soft decorative background glow */}
            <div className="absolute -left-8 -top-8 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl -z-10" />
            
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 shadow-xl aspect-square max-w-[500px] mx-auto">
              <img 
                src={posterImage}  
                alt="Base Streetwear Brand Message" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Bottom text overlay on image */}
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
                  Est. 2026
                </span>
                <p className="text-sm font-semibold tracking-wide mt-1">
                  Wear Your Faith Boldly
                </p>
              </div>
            </div>

            {/* Decorative float badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 top-10 bg-white border border-zinc-150 p-4 rounded-xl shadow-lg hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkles size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Premium Quality</p>
                <p className="text-[9px] text-zinc-500">100% Streetwear Grade</p>
              </div>
            </motion.div>
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
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                The Message
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 leading-tight">
                It's not just a shirt. <br />
                <span className="text-orange-600">It's who you are.</span>
              </h2>
              <p className="text-sm md:text-base text-zinc-500 leading-relaxed pt-2">
                We believe that premium apparel can start powerful conversations. Every thread, stitch, and graphic is crafted to be a bold testament of grace, truth, and identity.
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
                "Put on the new self, created to be like God in true righteousness and holiness."
              </p>
              <p className="text-[10px] uppercase font-black text-zinc-400 mt-2 tracking-widest">
                Ephesians 4:24
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandMessageSection;
