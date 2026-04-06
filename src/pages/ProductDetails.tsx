import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Package, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
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
            <div className="min-h-screen bg-background font-mono flex flex-col">
                <Navbar />
                <div className="flex-1 flex justify-center items-center opacity-50">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background font-mono flex flex-col">
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
        <div className="min-h-screen bg-background font-mono selection:bg-primary/30">
            <Navbar />

            {/* Breadcrumb Navigation */}
            <div className="pt-28 pb-4 px-6 border-b border-border bg-muted/10">
                <div className="container mx-auto flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-x-auto">
                    <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
                        <ArrowLeft size={12} /> Back to Shop
                    </Link>
                    <ChevronRight size={12} />
                    <Link to="/shop" className="hover:text-primary transition-colors">{product.gender}</Link>
                    <ChevronRight size={12} />
                    <Link to="/shop" className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight size={12} />
                    <span className="text-foreground truncate">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    
                    {/* Left Frame: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col select-none">
                        {/* Primary Image View */}
                        <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-muted/30 rounded-md border border-border overflow-hidden relative mb-4">
                            {product.stock === 0 && (
                                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                                    Out of Stock
                                </div>
                            )}
                            {product.stock > 0 && product.discountPrice && (
                                <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">
                                    Sale
                                </div>
                            )}
                            {activeImage ? (
                                <motion.img 
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={activeImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-30">
                                    <Package className="w-16 h-16" />
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails Row */}
                        {availableImages.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                                {availableImages.map((imgUrl, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={`shrink-0 w-20 sm:w-24 aspect-[4/5] rounded overflow-hidden border-2 transition-all ${activeImage === imgUrl ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                    >
                                        <img src={imgUrl} alt={`${product.name} Preview ${index+1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Frame: Details and Action */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full lg:w-1/2 flex flex-col"
                    >
                        <div className="mb-8">
                            <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground mb-3">{product.category}</p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-tight">{product.name}</h1>
                            
                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-3xl font-black">
                                    ${product.discountPrice || product.price}
                                </span>
                                {product.discountPrice && (
                                    <span className="text-xl text-muted-foreground line-through font-medium mb-1 border-red-500/50">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            
                            <div className="w-full h-px bg-border my-6"></div>
                            
                            <div className="prose prose-invert prose-sm font-mono text-muted-foreground leading-relaxed max-w-none">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Sizing Information */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Select Size</h3>
                                <button className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-muted-foreground hover:text-foreground transition-all">Size Guide</button>
                            </div>
                            
                            {product.sizes && product.sizes.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-12 min-w-[3rem] px-4 border rounded font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${selectedSize === size ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary/50 text-foreground"}`}
                                            disabled={product.stock === 0}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-12 inline-flex items-center px-6 border border-border rounded font-bold uppercase tracking-wider text-muted-foreground cursor-not-allowed">
                                    One Size
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        <div className="mb-8">
                            {product.stock > 0 ? (
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Item is in Stock
                                </p>
                            ) : (
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Currently Out of Stock
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 h-14 bg-background border border-border rounded flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] text-sm hover:border-foreground hover:bg-muted/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={16} /> Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 h-14 gradient-btn rounded font-black uppercase tracking-[0.2em] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy It Now
                            </button>
                        </div>
                        
                        {/* Guarantee Badges */}
                        <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Secure</span>
                                <span className="text-xs font-bold">Checkout</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Fast</span>
                                <span className="text-xs font-bold">Shipping</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quality</span>
                                <span className="text-xs font-bold">Apparel</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Base</span>
                                <span className="text-xs font-bold">Guarantee</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
