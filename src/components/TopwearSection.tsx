import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/utils";
import { Product } from "./FeaturedProducts";

const PRODUCTS_API = `${BASE_URL}/api/products`;

const TopwearSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopwearProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_API);
        if (response.ok) {
          const data = await response.json();
          // Filter to visible, and category matches Topwear (case insensitive)
          const filtered = data.filter(
            (p: Product) => p.isVisible && p.category?.toLowerCase() === "topwear"
          );
          setProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching topwear products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopwearProducts();
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveCardId(null);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleCardClick = (e: React.MouseEvent, productId: string) => {
    if (window.innerWidth < 768) {
      if (activeCardId !== productId) {
        e.preventDefault();
        e.stopPropagation();
        setActiveCardId(productId);
      }
    }
  };

  if (!isLoading && products.length === 0) {
    return null; // Don't render anything if no topwears are found
  }

  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="container mx-auto bg-zinc-200/90 border border-zinc-200/50 rounded-2xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Premium Selection
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Topwear Collection
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center p-20 opacity-50">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col"
              >
                <Link 
                  to={`/product/${product.id}`} 
                  onClick={(e) => handleCardClick(e, product.id)}
                  className="relative overflow-hidden rounded-sm bg-muted mb-4 aspect-[3/4] block"
                >
                  {product.stock === 0 && (
                     <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">
                        Out of Stock
                     </div>
                  )}
                  {product.stock > 0 && product.discountPrice && (
                    <div className="absolute top-3 left-3 z-10 bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                      Sale
                    </div>
                  )}
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-30">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
                  
                  {/* Action on hover */}
                  <span className={`absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 bg-black text-white py-2 md:py-3 px-1 md:px-4 rounded-sm text-[8px] min-[370px]:text-[10px] md:text-xs font-black tracking-[0.05em] min-[370px]:tracking-[0.15em] md:tracking-[0.2em] uppercase flex items-center justify-center gap-1 md:gap-2 transition-all duration-500 whitespace-nowrap ${
                    activeCardId === product.id 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                  }`}>
                    <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    View Product
                  </span>
                </Link>
                <div>
                   <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1.5">{product.category}</div>
                   <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-foreground mb-1 group-hover:underline decoration-border underline-offset-4 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                     <Link to={`/product/${product.id}`}>
                       {product.name}
                     </Link>
                   </h3>
                   <div className="flex items-center gap-2">
                       <span className="text-sm font-medium">
                         ${product.discountPrice || product.price}
                       </span>
                       {product.discountPrice && (
                         <span className="text-[10px] text-muted-foreground line-through">
                           ${product.price}
                         </span>
                       )}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/shop?search=Topwear" className="inline-block bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-600 hover:text-white hover:border-orange-600 px-8 py-3 rounded-md text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-sm">
               View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopwearSection;
