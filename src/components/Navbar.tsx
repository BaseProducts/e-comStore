import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, User, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading, clearCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home", "Shop", "About", "Contact"];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Base Logo" className="h-8 md:h-10 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : link === "Shop" ? "/shop" : link === "About" ? "/about" : link === "Contact" ? "/contact" : `/#${link.toLowerCase()}`}
                className="text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative group flex items-center">
              {localStorage.getItem("token") ? (
                <>
                  <button className="p-2 text-foreground hover:text-primary transition-colors cursor-default">
                    <User size={20} />
                  </button>
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-40 rounded-md bg-background border border-border shadow-lg py-1 flex flex-col font-mono text-[10px] font-bold uppercase tracking-widest">
                        <Link to="/orders" className="px-4 py-2 text-foreground hover:bg-muted transition-colors">Orders</Link>
                        {/* <a href="#" className="px-4 py-2 text-foreground hover:bg-muted transition-colors opacity-50 cursor-not-allowed">Your Profile</a> */}
                        <div className="border-t border-border my-1"></div>
                      <button 
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          clearCart();
                          window.location.href = "/auth";
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-muted transition-colors whitespace-nowrap"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button className="p-2 text-foreground hover:text-primary transition-colors cursor-default">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-32 rounded-md bg-background border border-border shadow-lg py-1 flex flex-col">
                      <Link to="/auth" className="px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">Login</Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-btn text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-md border-b border-border overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6 py-8">
                {links.map((link) => (
                  <Link
                    key={link}
                    to={link === "Home" ? "/" : link === "Shop" ? "/shop" : link === "About" ? "/about" : link === "Contact" ? "/contact" : `/#${link.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-[70] shadow-2xl border-l border-border flex flex-col font-mono"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} className="text-primary" />
                  <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
                  <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full">{totalItems}</span>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingBag size={48} className="mb-4 stroke-1" />
                    <p className="text-sm uppercase tracking-widest font-bold">Your cart is empty</p>
                    <Link 
                      to="/shop" 
                      onClick={() => setCartOpen(false)}
                      className="mt-6 text-xs text-primary border-b border-primary pb-1 font-bold"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-24 bg-muted rounded overflow-hidden shrink-0 border border-border">
                          {item.product.imageUrls?.[0] ? (
                            <img 
                              src={item.product.imageUrls[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={16} className="opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-sm font-black uppercase tracking-tight line-clamp-1">{item.product.name}</h3>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">Size: {item.size}</p>
                             <div className="flex items-center space-x-1 mt-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center rounded-sm border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                                >
                                  <Minus size={12} className="group-hover/btn:text-primary transition-colors" />
                                </button>
                                <div className="w-8 h-8 flex items-center justify-center text-xs font-black bg-background border-y border-border">
                                  {item.quantity}
                                </div>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-sm border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 transition-all active:scale-95 group/btn"
                                >
                                  <Plus size={12} className="group-hover/btn:text-primary transition-colors" />
                                </button>
                              </div>
                          </div>
                          <div className="text-sm font-black text-right">
                            ${(item.product.discountPrice || item.product.price) * item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-black">${totalPrice}</span>
                </div>
                <button 
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    setCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full gradient-btn py-4 rounded-sm font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Checkout Now
                </button>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
