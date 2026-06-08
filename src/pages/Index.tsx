import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandMessageSection from "@/components/BrandMessageSection";
import WhyBaseSection from "@/components/WhyBaseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO 
        title="BASE — Made with purpose"
        description="BASE — a clothing brand founded in 2018 by a pastoral family from Los Angeles. Premium apparel made with purpose."
        keywords="base, base products, clothing brand, premium apparel, streetwear, christian apparel"
        canonicalUrl="https://baseproducts.online/"
      />
      <Navbar />
      <HeroSection />
      <FeatureHighlights />
      <FeaturedProducts />
      <BrandMessageSection />
      <WhyBaseSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
