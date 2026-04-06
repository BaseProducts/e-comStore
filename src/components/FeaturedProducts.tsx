import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  gender: string;
  imageUrls: string[];
  isVisible: boolean;
  stock: number;
}

const PRODUCTS_API = `${BASE_URL}/api/products`;

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_API);
        if (response.ok) {
          const data = await response.json();
          // Filter to visible only, and get the most recent 4
          // The API retrieves by createdAt DESC so we just take first 4 visible
          const filtered = data.filter((p: Product) => p.isVisible);
          setProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  return (
    <section id="shop" className="py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
            New Arrivals
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Featured
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center p-20 opacity-50">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground uppercase tracking-widest text-sm flex flex-col items-center">
            <Package className="w-10 h-10 mb-4 opacity-50" />
            <p>No products featured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden rounded-sm bg-muted mb-4 aspect-[3/4]">
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
                  <Link to={`/product/${product.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 left-4 right-4 gradient-btn py-3 rounded-sm text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                    >
                      <ShoppingBag size={14} />
                      View Product
                    </motion.button>
                  </Link>
                </div>
                <div>
                   <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1.5">{product.category}</div>
                   <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1 group-hover:underline decoration-border underline-offset-4 line-clamp-1">
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
            <Link to="/shop" className="inline-block border border-border px-8 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300">
               View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
