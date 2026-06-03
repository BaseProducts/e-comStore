import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 px-6 md:px-12 border-t border-zinc-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1 - Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="Base Logo" 
                className="h-12 object-contain rounded-lg border border-zinc-800 bg-white p-1" 
              />
              <span className="text-white font-black text-xl tracking-wider uppercase">Base</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Founded in 2018 by a pastoral family from Los Angeles. We don't just sell apparel — we carry a message, wear a purpose, and proclaim the Kingdom of God.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/baseproducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300"
                title="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://www.facebook.com/people/Base-Produts/61577439501019/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300"
                title="Facebook"
              >
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-5">
            <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white">
              Shop Categories
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/shop?search=Topwear" className="hover:text-orange-400 transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?search=Bottomwear" className="hover:text-orange-400 transition-colors">
                  Bottomwears
                </Link>
              </li>
              <li>
                <Link to="/shop?search=Others" className="hover:text-orange-400 transition-colors">
                  Others
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-400 transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div className="space-y-5">
            <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white">
              Information
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-orange-400 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="space-y-5">
            <h4 className="text-xs font-black tracking-[0.25em] uppercase text-white">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors animate-none">
                <Phone size={14} className="text-orange-500 flex-shrink-0" />
                <span>+1(424)-206-3358</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors animate-none">
                <Mail size={14} className="text-orange-500 flex-shrink-0" />
                <span className="truncate">basecustomer2018@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors animate-none">
                <MapPin size={14} className="text-orange-500 flex-shrink-0" />
                <span>Torrance, CA</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copy Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-500 tracking-wider text-center sm:text-left">
            © {new Date().getFullYear()} Base. All rights reserved. Created with purpose.
          </p>
          
          {/* Dummy payment badges for premium feel */}
          <div className="flex items-center gap-3 opacity-30 grayscale hover:opacity-50 transition-opacity">
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              Stripe
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              Visa
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              MC
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
              Apple Pay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
