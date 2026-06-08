import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bannerImage from "@/assets/banner1.png";
import bannerImage2 from "@/assets/banner2.png";
import bannerImage3 from "@/assets/banner3.png";
import { BASE_URL } from "@/lib/utils";

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
    }, 6000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F0EDE8]">
      {/* Full-width hero image */}
      <div className="relative w-full aspect-[16/7] md:aspect-[1923/817]">
        {dynamicSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={`Base collection ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Minimal bottom text */}
        <div className="absolute bottom-8 md:bottom-12 left-0 right-0 flex flex-col items-center text-center px-6">
          <Link
            to="/shop"
            className="text-white/90 text-[11px] md:text-[13px] font-medium tracking-[0.2em] uppercase border-b border-white/40 pb-1 hover:border-white/80 transition-colors"
          >
            Shop the collection
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {dynamicSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-[2px] transition-all duration-500 ${
                index === current
                  ? "w-6 bg-white/80"
                  : "w-3 bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
