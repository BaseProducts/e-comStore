import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyBaseSection from "@/components/WhyBaseSection";
import BrandMessageSection from "@/components/BrandMessageSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <WhyBaseSection />
      <BrandMessageSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
