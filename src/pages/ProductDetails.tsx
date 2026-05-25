import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Package, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { BASE_URL } from "@/lib/utils";

interface Product {
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
    sizes: string[];
}

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    
                    // Set primary initial image
                    if (data.imageUrls && data.imageUrls.length > 0) {
                        setActiveImage(data.imageUrls[0]);
                    }
                    
                    // Preselect a size if available
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to add items to cart");
            navigate("/auth");
            return;
        }

        if (!selectedSize && product?.sizes && product.sizes.length > 0) {
            toast.error("Please select a size first");
            return;
        }
        
        if (product) {
            await addToCart(product.id, selectedSize || "One Size");
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to proceed with purchase");
            navigate("/auth");
            return;
        }

        if (!selectedSize && product?.sizes && product.sizes.length > 0) {
            toast.error("Please select a size first");
            return;
        }
        
        if (product) {
            await addToCart(product.id, selectedSize || "One Size");
            navigate("/checkout");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background font-sans flex flex-col">
                <Navbar />
                <div className="flex-1 flex justify-center items-center opacity-50">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background font-sans flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center">
                    <Package className="w-16 h-16 opacity-30 mb-4" />
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-4">Product Not Found</h2>
                    <Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-foreground hover:border-foreground transition-all">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const availableImages = product.imageUrls || [];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
            <SEO 
                title={`${product.name} | ${product.category}`}
                description={`${product.description} Shop this high-fidelity ${product.category} at Base Products (baseproducts.online) - priced at $${product.discountPrice || product.price}.`}
                keywords={`${product.name}, ${product.category}, baseproducts clothing, base products ${product.category}, faith garments`}
                canonicalUrl={`https://baseproducts.online/product/${product.id}`}
                ogImage={product.imageUrls?.[0] || "https://baseproducts.online/logo.png"}
                ogType="product"
            />
            <Navbar />

            {/* Breadcrumb Navigation */}
            <div className="pt-8 pb-2 px-4 sm:px-6">
                <div className="container mx-auto flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-zinc-400 whitespace-nowrap overflow-x-auto font-sans tracking-wide">
                    <Link to="/shop" className="hover:text-black transition-colors flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                        <ArrowLeft size={11} className="shrink-0" /> Shop
                    </Link>
                    <ChevronRight size={9} className="text-zinc-300 shrink-0" />
                    <span className="capitalize">{product.gender}</span>
                    <ChevronRight size={9} className="text-zinc-300 shrink-0" />
                    <span className="capitalize">{product.category}</span>
                    <ChevronRight size={9} className="text-zinc-300 shrink-0" />
                    <span className="text-zinc-800 font-bold truncate">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                    
                    {/* Left Frame: Image Gallery */}
                    <div className="w-[85%] md:w-full lg:w-[46%] xl:w-[42%] mx-auto md:mx-0 flex flex-col md:flex-row gap-4 select-none lg:max-w-[480px] xl:max-w-[520px]">
                        {/* Image Thumbnails Row / Column */}
                        {availableImages.length > 1 && (
                            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto pb-2 md:pb-0 scrollbar-none w-full md:w-24 shrink-0">
                                {availableImages.map((imgUrl, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={`shrink-0 w-16 md:w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === imgUrl ? "border-orange-500 scale-[1.03] shadow-md shadow-orange-500/10" : "border-zinc-200/60 opacity-60 hover:opacity-100"}`}
                                    >
                                        <img src={imgUrl} alt={`${product.name} Preview ${index+1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Primary Image View */}
                        <div className="flex-1 order-1 md:order-2 aspect-[4/5] bg-zinc-50 rounded-2xl border border-zinc-100 overflow-hidden relative shadow-sm group">
                            {product.stock === 0 && (
                                <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-2 rounded-full shadow-sm">
                                    Out of Stock
                                </div>
                            )}
                            {product.stock > 0 && product.discountPrice && (
                                <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-2 rounded-full shadow-sm animate-pulse">
                                    Sale
                                </div>
                            )}
                            {activeImage ? (
                                <motion.img 
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={activeImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <Package className="w-16 h-16 opacity-30" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Frame: Details and Action */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full lg:w-[54%] xl:w-[58%] flex flex-col font-sans"
                    >
                        <div className="mb-6">
                            <span className="inline-block text-[10px] font-extrabold tracking-[0.25em] uppercase text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full mb-3">
                                {product.category}
                            </span>
                            <h1 className="text-xl sm:text-3xl lg:text-[40px] font-normal uppercase tracking-wider text-zinc-950 mb-3 leading-[1.1]">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-2xl sm:text-3xl font-semibold text-zinc-950">
                                    ${product.discountPrice || product.price}
                                </span>
                                {product.discountPrice && (
                                    <span className="text-sm sm:text-lg text-zinc-400 line-through font-normal mb-1">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            
                            <div className="w-full h-px bg-zinc-100 my-5"></div>
                            
                            <div className="text-zinc-600 text-sm leading-relaxed max-w-none font-medium">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Sizing Information */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-800">Select Size</h3>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 hover:text-black hover:border-black transition-all">Size Guide</button>
                            </div>
                            
                            {product.sizes && product.sizes.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {product.sizes.map((size) => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-11 min-w-[2.75rem] px-3.5 rounded-xl border-2 font-black uppercase tracking-wider text-xs transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${selectedSize === size ? "bg-black border-black text-white shadow-md shadow-black/10 scale-105" : "border-zinc-200 hover:border-zinc-800 text-zinc-700 hover:text-black"}`}
                                            disabled={product.stock === 0}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-11 inline-flex items-center px-5 border border-zinc-200 rounded-xl font-bold uppercase tracking-wider text-xs text-zinc-400 cursor-not-allowed">
                                    One Size
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready to Dispatch
                                </p>
                            ) : (
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-50 px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 border border-red-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sold Out
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3.5 mt-2">
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full sm:flex-1 h-12 sm:h-14 shrink-0 bg-zinc-50 border-2 border-zinc-200 hover:border-black rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                <ShoppingBag size={15} /> Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="w-full sm:flex-1 h-12 sm:h-14 shrink-0 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                Buy It Now
                            </button>
                        </div>
                        
                        {/* Guarantee Badges */}
                        <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <span className="block text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1">Secure</span>
                                <span className="text-xs font-bold text-zinc-800">SSL Checkout</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="block text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1">Fast</span>
                                <span className="text-xs font-bold text-zinc-800">48h Dispatch</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="block text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1">Quality</span>
                                <span className="text-xs font-bold text-zinc-800">Heavy Cotton</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="block text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1">Authentic</span>
                                <span className="text-xs font-bold text-zinc-800">Original Base</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default ProductDetails;
