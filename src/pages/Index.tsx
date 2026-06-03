import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import FeaturedProducts from "@/components/FeaturedProducts";

import WhyBaseSection from "@/components/WhyBaseSection";
import BrandMessageSection from "@/components/BrandMessageSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Official Store | Wear Your Faith"
        description="Base Products — founded in 2018 by a pastoral family from Los Angeles. Premium faith-driven apparel that carries a message, wears a purpose, and proclaims the Kingdom of God."
        keywords="baseproducts, base products, baseproducts.online, christian apparel, faith-based clothing, kingdom of god apparel, christian brand, pastoral family los angeles"
        canonicalUrl="https://baseproducts.online/"
      />
      <Navbar />
      <HeroSection />
      <hr className="border-t border-border" />
      <FeatureHighlights />
      <hr className="border-t border-border" />
      <FeaturedProducts />
      <hr className="border-t border-border" />
      <BrandMessageSection />
      <hr className="border-t border-border" />
      <WhyBaseSection />
      <hr className="border-t border-border" />
      <TestimonialsSection />
      <hr className="border-t border-border" />
      <FooterSection />
    </div>
  );
};

export default Index;
