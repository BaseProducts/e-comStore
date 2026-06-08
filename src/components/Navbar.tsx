import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingBag, Menu, X, User, Trash2, Plus, Minus,
  Search, ChevronDown
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading, clearCart } = useCart();
  const [user, setUser] = useState<{ fullName?: string } | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-trigger-wrap")) {
        setUserOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (mobileOpen || cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen, cartOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setMobileOpen(false);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  const links = ["Shop", "About", "Help", "Contact"];

  const getLinkPath = (link: string) => {
    if (link === "Shop") return "/shop";
    if (link === "About") return "/about";
    if (link === "Contact") return "/contact";
    return "/";
  };

  const isLinkActive = (link: string) => {
    const path = getLinkPath(link);
    if (path === "/shop") {
      return location.pathname.startsWith("/shop") || location.pathname.startsWith("/product");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF9F7]/95 backdrop-blur-md shadow-sm"
            : "bg-[#FAF9F7]"
        }`}
      >
        <div className="border-b border-[#E8E5E0]">
          <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-6 lg:px-8">
            
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4 lg:w-1/3">
              <button
                className="lg:hidden p-1 text-[#1A1A1A] -ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link to="/" className="flex items-center">
                <img src={logoImg} alt="Base" className="h-8 md:h-9 object-contain" />
              </Link>
            </div>

            {/* Center: Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-10 lg:w-1/3">
              {links.map((link) => (
                link === "Help" ? (
                  <div key={link} className="relative group py-6 -my-6">
                    <button className="flex items-center gap-1 text-[14px] font-medium tracking-wide text-[#4A4A4A] group-hover:text-[#1A1A1A] transition-colors">
                      {link}
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    {/* Dropdown menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-white border border-[#E8E5E0] shadow-lg w-40 py-2 flex flex-col">
                        <Link to="/faq" className="px-4 py-2 text-[13px] text-[#4A4A4A] hover:bg-[#FAF9F7] hover:text-[#1A1A1A] transition-colors">
                          FAQ
                        </Link>
                        <Link to="/reviews" className="px-4 py-2 text-[13px] text-[#4A4A4A] hover:bg-[#FAF9F7] hover:text-[#1A1A1A] transition-colors">
                          Reviews
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link}
                    to={getLinkPath(link)}
                    className={`text-[14px] font-medium tracking-wide transition-colors ${
                      isLinkActive(link) 
                        ? "text-[#1A1A1A]" 
                        : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link}
                  </Link>
                )
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-5 lg:w-1/3">
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#1A1A1A] hover:text-[#6B6B6B] transition-colors"
              >
                <Search size={18} />
              </button>

              {/* User */}
              <div className="relative user-trigger-wrap">
                {user ? (
                  <>
                    <button 
                      onClick={() => setUserOpen(!userOpen)}
                      className="text-[#1A1A1A] hover:text-[#6B6B6B] transition-colors"
                    >
                      <User size={18} />
                    </button>
                    <div className={`absolute right-0 top-full pt-3 transition-all duration-200 z-50 ${userOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <div className="w-44 bg-white border border-[#E8E5E0] shadow-lg py-2">
                        <div className="px-4 py-2 border-b border-[#E8E5E0]">
                          <p className="text-[11px] text-[#8A8A8A]">Signed in as</p>
                          <p className="text-[13px] font-medium text-[#1A1A1A] truncate">{user.fullName}</p>
                        </div>
                        <Link to="/orders" className="block px-4 py-2 text-[13px] text-[#1A1A1A] hover:bg-[#F5F3F0] transition-colors">Orders</Link>
                        <button 
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            clearCart();
                            setUser(null);
                            window.location.href = "/auth";
                          }}
                          className="w-full px-4 py-2 text-[13px] text-left text-red-600 hover:bg-[#F5F3F0] transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to="/auth" className="text-[#1A1A1A] hover:text-[#6B6B6B] transition-colors">
                    <User size={18} />
                  </Link>
                )}
              </div>

              {/* Cart */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative text-[#1A1A1A] hover:text-[#6B6B6B] transition-colors"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] font-medium flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-[#E8E5E0]"
            >
              <div className="container mx-auto px-6 lg:px-8 py-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-xl mx-auto">
                  <Search size={16} className="text-[#8A8A8A] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-[14px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchVal(""); }}
                    className="text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-[280px] bg-[#FAF9F7] shadow-2xl z-[70] flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-[#E8E5E0]">
                <img src={logoImg} alt="Base" className="h-7 object-contain" />
                <button onClick={() => setMobileOpen(false)} className="text-[#1A1A1A]">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-[15px] font-medium transition-colors ${
                    location.pathname === "/" ? "text-[#1A1A1A]" : "text-[#8A8A8A]"
                  }`}
                >
                  Home
                </Link>
                {links.map((link) => {
                  if (link === "Help") {
                    return (
                      <div key="help-mobile" className="flex flex-col">
                        <Link
                          to="/faq"
                          onClick={() => setMobileOpen(false)}
                          className={`py-3 text-[15px] font-medium transition-colors ${
                            location.pathname === "/faq" ? "text-[#1A1A1A]" : "text-[#8A8A8A]"
                          }`}
                        >
                          FAQ
                        </Link>
                        <Link
                          to="/reviews"
                          onClick={() => setMobileOpen(false)}
                          className={`py-3 text-[15px] font-medium transition-colors ${
                            location.pathname === "/reviews" ? "text-[#1A1A1A]" : "text-[#8A8A8A]"
                          }`}
                        >
                          Reviews
                        </Link>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link}
                      to={getLinkPath(link)}
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 text-[15px] font-medium transition-colors ${
                        isLinkActive(link) ? "text-[#1A1A1A]" : "text-[#8A8A8A]"
                      }`}
                    >
                      {link}
                    </Link>
                  );
                })}

                <form onSubmit={handleSearchSubmit} className="mt-6 relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-white text-[#1A1A1A] placeholder:text-[#B5B5B5] text-[13px] px-4 py-3 border border-[#E8E5E0] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                    <Search size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF9F7] z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-[#E8E5E0] flex items-center justify-between">
                <h2 className="text-[15px] font-medium text-[#1A1A1A]">
                  Cart ({totalItems})
                </h2>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={32} className="text-[#D5D0CA] mb-4" />
                    <p className="text-[13px] text-[#8A8A8A] mb-6">Your cart is empty</p>
                    <Link 
                      to="/shop" 
                      onClick={() => setCartOpen(false)}
                      className="text-[12px] font-medium text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5"
                    >
                      Continue shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 bg-[#F0EDE8] shrink-0 overflow-hidden">
                          {item.product.imageUrls?.[0] ? (
                            <img 
                              src={item.product.imageUrls[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={14} className="text-[#D5D0CA]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-[13px] font-medium text-[#1A1A1A] line-clamp-1">{item.product.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#B5B5B5] hover:text-[#1A1A1A] transition-colors shrink-0"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <p className="text-[11px] text-[#8A8A8A] mt-0.5">Size: {item.size}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[#E8E5E0]">
                              <button 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center text-[#8A8A8A] hover:text-[#1A1A1A] disabled:opacity-30 transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <div className="w-8 h-7 flex items-center justify-center text-[12px] font-medium text-[#1A1A1A] border-x border-[#E8E5E0]">
                                {item.quantity}
                              </div>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <span className="text-[13px] font-medium text-[#1A1A1A]">
                              ${(item.product.discountPrice || item.product.price) * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#E8E5E0]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[13px] text-[#8A8A8A]">Subtotal</span>
                    <span className="text-[15px] font-medium text-[#1A1A1A]">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      navigate("/checkout");
                    }}
                    className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-3.5 text-[13px] font-medium tracking-wide transition-colors"
                  >
                    Checkout
                  </button>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="w-full mt-3 text-[12px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
