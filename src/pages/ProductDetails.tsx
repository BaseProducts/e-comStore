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

interface CustomField {
    id: string;
    name: string;
    type: 'text' | 'color';
    values: string[];
    colorCodes?: string[];
}

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
    customFields?: CustomField[];
}

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [customSelections, setCustomSelections] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.imageUrls && data.imageUrls.length > 0) {
                        setActiveImage(data.imageUrls[0]);
                    }
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                    const colorField = data.customFields?.find((f: CustomField) => f.type === 'color');
                    if (colorField && colorField.values.length > 0) {
                        setSelectedColor(colorField.values[0]);
                    }
                    const initialSelections: Record<string, string> = {};
                    data.customFields?.forEach((f: CustomField) => {
                        if (f.type === 'text' && f.values.length > 0) {
                            initialSelections[f.name] = f.values[0];
                        }
                    });
                    setCustomSelections(initialSelections);
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
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) { toast.error("Please login to add items to cart"); navigate("/auth"); return; }
        if (!selectedSize && product?.sizes && product.sizes.length > 0) { toast.error("Please select a size first"); return; }
        const colorField = product?.customFields?.find(f => f.type === 'color');
        if (colorField && colorField.values.length > 0 && !selectedColor) { toast.error("Please select a color"); return; }
        if (product) await addToCart(product.id, selectedSize || "One Size", selectedColor, customSelections);
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");
        if (!token) { toast.error("Please login to proceed with purchase"); navigate("/auth"); return; }
        if (!selectedSize && product?.sizes && product.sizes.length > 0) { toast.error("Please select a size first"); return; }
        const colorField = product?.customFields?.find(f => f.type === 'color');
        if (colorField && colorField.values.length > 0 && !selectedColor) { toast.error("Please select a color"); return; }
        if (product) { await addToCart(product.id, selectedSize || "One Size", selectedColor, customSelections); navigate("/checkout"); }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center">
                    <Package className="w-12 h-12 text-[#D5D0CA] mb-4" />
                    <h2 className="text-[18px] font-medium text-[#1A1A1A] mb-4">Product not found</h2>
                    <Link to="/shop" className="text-[13px] text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5 hover:text-[#6B6B6B] hover:border-[#6B6B6B] transition-colors">
                        Return to shop
                    </Link>
                </div>
            </div>
        );
    }

    const availableImages = product.imageUrls || [];
    const colorField = product.customFields?.find(f => f.type === 'color');
    const textFields = product.customFields?.filter(f => f.type === 'text' && f.values.length > 0) || [];

    return (
        <div className="min-h-screen bg-[#FAF9F7]">
            <SEO 
                title={`${product.name} | ${product.category}`}
                description={`${product.description} Shop this ${product.category} at Base Products — $${product.discountPrice || product.price}.`}
                keywords={`${product.name}, ${product.category}, base products clothing`}
                canonicalUrl={`https://baseproducts.online/product/${product.id}`}
                ogImage={product.imageUrls?.[0] || "https://baseproducts.online/logo.png"}
                ogType="product"
            />
            <Navbar />

            {/* Breadcrumb */}
            <div className="container mx-auto px-6 lg:px-8 pt-8 pb-4">
                <div className="flex items-center gap-2 text-[12px] text-[#8A8A8A]">
                    <Link to="/shop" className="flex items-center gap-1 hover:text-[#1A1A1A] transition-colors">
                        <ArrowLeft size={12} /> Shop
                    </Link>
                    <ChevronRight size={10} className="text-[#D5D0CA]" />
                    <span>{product.category}</span>
                    <ChevronRight size={10} className="text-[#D5D0CA]" />
                    <span className="text-[#1A1A1A] truncate">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                    
                    {/* Image Gallery */}
                    <div className="w-full lg:w-[50%] flex flex-col md:flex-row gap-3">
                        {availableImages.length > 1 && (
                            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 w-full md:w-20 shrink-0">
                                {availableImages.map((imgUrl, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={`shrink-0 w-16 md:w-full aspect-[3/4] overflow-hidden border transition-all ${
                                            activeImage === imgUrl ? "border-[#1A1A1A]" : "border-[#E8E5E0] opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={imgUrl} alt={`${product.name} ${index+1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex-1 order-1 md:order-2 aspect-[3/4] bg-[#F0EDE8] overflow-hidden relative">
                            {product.stock === 0 && (
                                <div className="absolute top-3 left-3 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2.5 py-1">
                                    Sold out
                                </div>
                            )}
                            {product.stock > 0 && product.discountPrice && (
                                <div className="absolute top-3 left-3 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2.5 py-1">
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
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-12 h-12 text-[#D5D0CA]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full lg:w-[50%] flex flex-col">
                        <div className="mb-6">
                            <p className="text-[11px] text-[#8A8A8A] tracking-wide mb-2">{product.category}</p>
                            <h1 className="text-[22px] md:text-[28px] font-medium text-[#1A1A1A] tracking-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-2.5 mb-6">
                                <span className="text-[20px] md:text-[24px] font-medium text-[#1A1A1A]">
                                    ${product.discountPrice || product.price}
                                </span>
                                {product.discountPrice && (
                                    <span className="text-[14px] text-[#B5B5B5] line-through mb-0.5">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            <div className="w-full h-px bg-[#E8E5E0] mb-5"></div>
                            <p className="text-[13px] text-[#6B6B6B] leading-relaxed">{product.description}</p>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[12px] font-medium text-[#1A1A1A]">Size</h3>
                            </div>
                            {product.sizes && product.sizes.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={product.stock === 0}
                                            className={`h-10 min-w-[2.5rem] px-3.5 border text-[12px] font-medium transition-all disabled:opacity-30 ${
                                                selectedSize === size
                                                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                                    : "border-[#E8E5E0] text-[#4A4A4A] hover:border-[#1A1A1A]"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-10 inline-flex items-center px-4 border border-[#E8E5E0] text-[12px] text-[#8A8A8A]">
                                    One Size
                                </div>
                            )}
                        </div>

                        {/* Color Selection */}
                        {colorField && colorField.values.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[12px] font-medium text-[#1A1A1A] mb-3">Color</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {colorField.values.map((colorName, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(colorName)}
                                            disabled={product.stock === 0}
                                            className={`flex items-center gap-2 px-3 py-2 border text-[12px] font-medium transition-all disabled:opacity-30 ${
                                                selectedColor === colorName
                                                    ? "border-[#1A1A1A] bg-[#F5F3F0]"
                                                    : "border-[#E8E5E0] hover:border-[#1A1A1A]"
                                            }`}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border shrink-0"
                                                style={{
                                                    backgroundColor: colorField.colorCodes?.[i] || '#000',
                                                    borderColor: selectedColor === colorName ? '#1A1A1A' : '#E8E5E0',
                                                }}
                                            />
                                            <span className="text-[#4A4A4A]">{colorName}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Text Fields */}
                        {textFields.length > 0 && (
                            <div className="space-y-5 mb-6">
                                {textFields.map((field) => (
                                    <div key={field.id}>
                                        <h3 className="text-[12px] font-medium text-[#1A1A1A] mb-3">{field.name || 'Options'}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {field.values.map((val, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCustomSelections(prev => ({ ...prev, [field.name]: val }))}
                                                    disabled={product.stock === 0}
                                                    className={`h-10 px-3.5 border text-[12px] font-medium transition-all disabled:opacity-30 ${
                                                        customSelections[field.name] === val
                                                            ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                                            : "border-[#E8E5E0] text-[#4A4A4A] hover:border-[#1A1A1A]"
                                                    }`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <p className="text-[11px] text-emerald-600 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In stock, ready to ship
                                </p>
                            ) : (
                                <p className="text-[11px] text-red-500 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sold out
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 py-4 md:py-4 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center gap-2 text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={15} /> Add to cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 py-4 md:py-4 bg-[#1A1A1A] text-white hover:bg-[#333] text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Buy now
                            </button>
                        </div>
                        
                        {/* Trust badges */}
                        <div className="mt-8 pt-6 border-t border-[#E8E5E0] flex justify-between md:justify-start md:gap-6 w-full text-[9px] md:text-[11px] text-[#8A8A8A]">
                            <span className="whitespace-nowrap">Secure checkout</span>
                            <span className="whitespace-nowrap">Fast dispatch</span>
                            <span className="whitespace-nowrap">Premium quality</span>
                            <span className="whitespace-nowrap">Easy returns</span>
                        </div>
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default ProductDetails;
