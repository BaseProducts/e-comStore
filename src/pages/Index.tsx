import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureHighlights from "@/components/FeatureHighlights";
import FeaturedProducts from "@/components/FeaturedProducts";
import TopwearSection from "@/components/TopwearSection";
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
        description="Welcome to Base Products (baseproducts.online). Premium Christian streetwear merging high-end silhouettes, heavyweight fabrics, and bold testimonies."
        keywords="baseproducts, base products, baseproducts.online, christian streetwear, faith-based clothing, christian hoodies, christian tees, custom streetwear"
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
      <TopwearSection />
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
