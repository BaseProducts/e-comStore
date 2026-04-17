import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <img src="/logo.png" alt="Base Logo" className="h-10 object-contain mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Faith-driven streetwear for those who wear their beliefs boldly.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary-foreground">
                <Phone size={14} className="text-muted-foreground" />
                (424) 206-3358
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground">
                <Mail size={14} className="text-muted-foreground" />
                basecustomer2018@gmail.com
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground">
                <MapPin size={14} className="text-muted-foreground" />
                Torrance, CA
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Follow
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/baseproducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary-foreground hover:text-primary transition-colors w-fit"
              >
                <Instagram size={16} />
                @baseproducts
              </a>
              <a
                href="https://www.facebook.com/people/Base-Produts/61577439501019/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary-foreground hover:text-primary transition-colors w-fit"
              >
                <Facebook size={16} />
                Base Products
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} Base. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
