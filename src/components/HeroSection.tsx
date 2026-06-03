import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bannerImage from "@/assets/banner1.png";
import bannerImage2 from "@/assets/banner2.png";
import bannerImage3 from "@/assets/banner3.png";
import { BASE_URL } from "@/lib/utils";
const slides = [
  { image: bannerImage },
  { image: bannerImage2 },
  { image: bannerImage3 },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [dynamicSlides, setDynamicSlides] = useState([
    { image: bannerImage },
    { image: bannerImage2 },
    { image: bannerImage3 },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/settings`);
        const { data } = await res.json();
        if (data) {
          setDynamicSlides([
            { image: data.banner_image_1 || bannerImage },
            { image: data.banner_image_2 || bannerImage2 },
            { image: data.banner_image_3 || bannerImage3 },
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % dynamicSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % dynamicSlides.length);
  };

  return (
    <section className="relative w-full aspect-[1923/817] overflow-hidden bg-muted/20">
      {/* Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={dynamicSlides[current].image}
              alt={`Banner ${current + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-foreground shadow-md hover:scale-105 active:scale-95 transition-all border border-border"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-foreground shadow-md hover:scale-105 active:scale-95 transition-all border border-border"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Centered Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {dynamicSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
              index === current 
                ? "w-6 md:w-8 bg-primary shadow-sm" 
                : "w-2 md:w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
