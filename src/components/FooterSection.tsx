import { Instagram, Facebook } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#A0A0A0]">
      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1 - Brand */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-2.5">
              <img 
                src={logoImg} 
                alt="Base" 
                className="h-9 object-contain rounded bg-white p-0.5" 
              />
              <span className="text-white text-[15px] font-medium tracking-wide">Base</span>
            </div>
            <p className="text-[12px] text-[#787878] leading-relaxed max-w-[260px]">
              Made with purpose. Founded in 2018 by a pastoral family from Los Angeles.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/baseproducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#787878] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/people/Base-Produts/61577439501019/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#787878] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-medium text-white tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/shop" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/shop?search=Topwear" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Topwear
                </Link>
              </li>
              <li>
                <Link to="/shop?search=Bottomwear" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Bottomwear
                </Link>
              </li>
              <li>
                <Link to="/shop?search=Others" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Info */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-medium text-white tracking-wide">
              Info
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Shipping & returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-[12px] text-[#787878] hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-medium text-white tracking-wide">
              Get in touch
            </h4>
            <ul className="space-y-2.5 text-[12px] text-[#787878]">
              <li>
                <a href="mailto:basecustomer2018@gmail.com" className="hover:text-white transition-colors">
                  basecustomer2018@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+14242063358" className="hover:text-white transition-colors">
                  +1 (424) 206-3358
                </a>
              </li>
              <li>Torrance, California</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2A2A]">
        <div className="container mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#585858]">
            © {new Date().getFullYear()} Base. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-[#484848]">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
