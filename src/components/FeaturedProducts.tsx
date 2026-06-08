import { useState, useEffect } from "react";
import { Package } from "lucide-react";
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
          const filtered = data.filter((p: Product) => p.isVisible);
          setProducts(filtered.slice(0, 8));
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
    <section className="py-16 md:py-24 px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <h2 className="text-[22px] md:text-[28px] font-medium text-[#1A1A1A] tracking-tight">
              Latest drop
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-[12px] md:text-[13px] text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors tracking-wide px-5 py-2.5"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-8 h-8 text-[#D5D0CA] mx-auto mb-3" />
            <p className="text-[13px] text-[#8A8A8A]">No products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group flex flex-col"
              >
                {/* Product image */}
                <div className="relative overflow-hidden bg-[#F0EDE8] mb-3 md:mb-4 aspect-[3/4]">
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
                      Sold out
                    </div>
                  )}
                  {product.stock > 0 && product.discountPrice && (
                    <div className="absolute top-2 left-2 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
                      Sale
                    </div>
                  )}
                  {product.imageUrls?.[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#D5D0CA]" />
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h3 className="text-[12px] md:text-[13px] font-medium text-[#1A1A1A] line-clamp-1 group-hover:underline underline-offset-2 decoration-[#D5D0CA]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] md:text-[13px] text-[#1A1A1A]">
                      ${product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-[11px] text-[#B5B5B5] line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
