import { useState, useEffect, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, ChevronDown, Package, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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
}

interface Category {
    id: string;
    name: string;
}

const PRODUCTS_API = `${BASE_URL}/api/products`;
const CATEGORIES_API = `${BASE_URL}/api/categories`;

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc">("featured");

    // Mobile sidebar toggle
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(PRODUCTS_API),
                    fetch(CATEGORIES_API)
                ]);

                if (productsRes.ok) {
                    const data = await productsRes.json();
                    // Only keep visible products
                    setProducts(data.filter((p: Product) => p.isVisible));
                }
                
                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(catData);
                }
            } catch (error) {
                console.error("Failed to fetch shop data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived state for filtering and sorting
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(q) || 
                p.description?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        if (selectedGenders.length > 0) {
            result = result.filter(p => selectedGenders.includes(p.gender));
        }

        switch (sortOrder) {
            case "price-asc":
                result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                break;
            case "price-desc":
                result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                break;
            default:
                // default implies keeping the fetched order, which is desc createdAt
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategories, selectedGenders, sortOrder]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const toggleGender = (gender: string) => {
        setSelectedGenders(prev => 
            prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-mono">
            <Navbar />
            
            {/* Top Header Section */}
            <div className="pt-28 pb-6 px-6 border-b border-border bg-muted/20">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Shop Collection</h1>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 bg-background border border-border rounded-md font-mono text-sm tracking-wide focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="md:hidden flex-1 h-12 flex items-center justify-center gap-2 border border-border bg-background rounded-md text-sm uppercase tracking-widest font-bold"
                            >
                                <Filter size={16} /> Filters
                            </button>
                            <div className="relative w-full md:w-56">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as any)}
                                    className="w-full h-12 pl-4 pr-10 appearance-none bg-background border border-border rounded-md text-[10px] md:text-sm uppercase tracking-widest font-black focus:outline-none focus:border-primary cursor-pointer transition-all hover:bg-muted/30"
                                >
                                    <option value="featured">Sort: Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 container mx-auto px-6 py-8 flex items-start gap-8 relative">
                
                {/* Sidebar Filter Panel */}
                <aside className={`fixed md:sticky bottom-0 md:top-32 left-0 w-full md:w-64 h-[75vh] md:h-auto bg-background md:bg-transparent z-50 p-8 md:p-0 transition-transform duration-500 ease-in-out md:translate-x-0 overflow-y-auto ${showSidebar ? "translate-y-0" : "translate-y-full md:translate-y-0"} rounded-t-[2.5rem] md:rounded-none border-t md:border-t-0 md:border-r border-border shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] md:shadow-none`}>
                    <div className="flex items-center justify-between md:hidden mb-10">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Filters</h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Refine your search</p>
                        </div>
                        <button 
                            onClick={() => setShowSidebar(false)} 
                            className="w-10 h-10 flex items-center justify-center bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Gender Filter */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Gender</h3>
                            <div className="space-y-3">
                                {["Men", "Women", "Kid", "Unisex"].map(gender => (
                                <label key={gender} onClick={() => toggleGender(gender)} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${selectedGenders.includes(gender) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary"}`}>
                                            {selectedGenders.includes(gender) && <X size={12} />}
                                        </div>
                                        <span className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors">{gender}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border w-full"></div>

                        {/* Category Filter */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Categories</h3>
                            <div className="space-y-3">
                                {categories.map(category => (
                                    <label key={category.id} onClick={() => toggleCategory(category.name)} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${selectedCategories.includes(category.name) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary"}`}>
                                            {selectedCategories.includes(category.name) && <X size={12} />}
                                        </div>
                                        <span className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="flex-1 min-w-0 pb-20">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <span className="uppercase tracking-widest text-sm font-bold">Loading Collection...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">No products found</h2>
                            <p className="text-muted-foreground text-sm uppercase tracking-widest max-w-sm">Try adjusting your search criteria to find what you're looking for.</p>
                            <button 
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategories([]);
                                    setSelectedGenders([]);
                                }}
                                className="mt-8 px-6 py-3 border border-border rounded-md text-sm font-bold uppercase tracking-widest hover:border-foreground transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                                Showing {filteredProducts.length} Results
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
                                {filteredProducts.map(product => (
                                    <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col cursor-pointer">
                                        <div className="aspect-[3/4] rounded-md overflow-hidden bg-muted relative mb-4">
                                            {product.stock > 0 ? (
                                                <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">
                                                    In Stock
                                                </div>
                                            ) : (
                                                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">
                                                    Out of Stock
                                                </div>
                                            )}
                                            {product.imageUrls?.[0] ? (
                                                <img 
                                                    src={product.imageUrls[0]} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                                    <Package className="w-12 h-12 mb-2" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                                                </div>
                                            )}
                                            {/* Hover Action */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                                <div className="w-full py-3 bg-white text-black text-center font-black uppercase tracking-widest text-xs rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white">
                                                    View Product
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">{product.category}</div>
                                            <h3 className="text-sm font-black uppercase tracking-tight mb-2 group-hover:underline decoration-2 underline-offset-4">{product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">
                                                    ${product.discountPrice || product.price}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-xs text-muted-foreground line-through font-medium">
                                                        ${product.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            
            {/* Mobile Overlay */}
            {showSidebar && (
                <div 
                    onClick={() => setShowSidebar(false)}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                ></div>
            )}
        </div>
    );
};

export default Shop;
