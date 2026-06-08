import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Package, X, Check, ArrowUpDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import { BASE_URL } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

    const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc">("featured");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const [accordions, setAccordions] = useState({ gender: true, category: true, price: true });
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(PRODUCTS_API),
                    fetch(CATEGORIES_API)
                ]);

                let fetchedCategories: Category[] = [];
                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(catData);
                    fetchedCategories = catData;
                }

                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setProducts(data.filter((p: Product) => p.isVisible));
                }

                const query = searchParams.get("search") || "";
                if (query) {
                    const matchedCategory = fetchedCategories.find(
                        c => c.name.toLowerCase() === query.toLowerCase()
                    );
                    if (matchedCategory) {
                        setSelectedCategories([matchedCategory.name]);
                        setSearchQuery("");
                    } else {
                        setSearchQuery(query);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch shop data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const query = searchParams.get("search") || "";
        if (query) {
            const matchedCategory = categories.find(c => c.name.toLowerCase() === query.toLowerCase());
            if (matchedCategory) {
                setSelectedCategories([matchedCategory.name]);
                setSearchQuery("");
            } else {
                setSearchQuery(query);
            }
        }
    }, [searchParams, categories]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
        return counts;
    }, [products]);

    const genderCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        products.forEach(p => { counts[p.gender] = (counts[p.gender] || 0) + 1; });
        return counts;
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
        }
        if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.category));
        if (selectedGenders.length > 0) result = result.filter(p => selectedGenders.includes(p.gender));
        if (appliedMinPrice !== null) result = result.filter(p => (p.discountPrice || p.price) >= appliedMinPrice);
        if (appliedMaxPrice !== null) result = result.filter(p => (p.discountPrice || p.price) <= appliedMaxPrice);

        switch (sortOrder) {
            case "price-asc": result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
            case "price-desc": result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
        }
        return result;
    }, [products, searchQuery, selectedCategories, selectedGenders, appliedMinPrice, appliedMaxPrice, sortOrder]);

    const toggleCategory = (category: string) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    const toggleGender = (gender: string) => setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]);

    const applyQuickPrice = (min: number | null, max: number | null) => {
        setAppliedMinPrice(min);
        setAppliedMaxPrice(max);
    };

    const clearAllFilters = () => {
        setSearchQuery(""); setSelectedCategories([]); setSelectedGenders([]);
        setAppliedMinPrice(null); setAppliedMaxPrice(null);
        setSortOrder("featured"); setSearchParams({});
    };

    const toggleAccordion = (section: "gender" | "category" | "price") => setAccordions(prev => ({ ...prev, [section]: !prev[section] }));

    const sortLabels = { featured: "Featured", "price-asc": "Price: Low → High", "price-desc": "Price: High → Low" };
    const hasActiveFilters = selectedCategories.length > 0 || selectedGenders.length > 0 || searchQuery || appliedMinPrice !== null || appliedMaxPrice !== null;

    const FilterCheckbox = ({ checked, label, count, onClick }: { checked: boolean; label: string; count: number; onClick: () => void }) => (
        <div onClick={onClick} className="flex items-center justify-between cursor-pointer group py-1">
            <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 border flex items-center justify-center transition-all ${checked ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "border-[#D5D0CA] group-hover:border-[#1A1A1A]"}`}>
                    {checked && <Check size={10} strokeWidth={2.5} />}
                </div>
                <span className="text-[12px] text-[#4A4A4A]">{label}</span>
            </div>
            <span className="text-[11px] text-[#B5B5B5]">{count}</span>
        </div>
    );

    const FilterSection = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
        <div className="border-b border-[#E8E5E0] pb-5">
            <button onClick={onToggle} className="w-full flex items-center justify-between text-[12px] font-medium text-[#1A1A1A] mb-3">
                <span>{title}</span>
                {isOpen ? <ChevronUp size={14} className="text-[#8A8A8A]" /> : <ChevronDown size={14} className="text-[#8A8A8A]" />}
            </button>
            {isOpen && <div className="space-y-1.5">{children}</div>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            <SEO title="Shop — BASE" description="Explore the BASE collection. Premium apparel made with purpose." keywords="base products shop, clothing, streetwear" canonicalUrl="https://baseproducts.online/shop" />
            <Navbar />

            {/* Page header */}
            <div className="container mx-auto px-6 lg:px-8 pt-10 md:pt-14 pb-6 md:pb-8">
                <h1 className="text-[24px] md:text-[32px] font-medium text-[#1A1A1A] tracking-tight">Shop</h1>
            </div>

            {/* Search + Sort bar */}
            <div className="border-y border-[#E8E5E0] bg-white">
                <div className="container mx-auto px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="w-full sm:max-w-sm flex items-center gap-2 border border-[#E8E5E0] px-3 py-2 focus-within:border-[#1A1A1A] transition-colors">
                        <Search size={14} className="text-[#B5B5B5] shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-[13px] text-[#1A1A1A] placeholder:text-[#B5B5B5] outline-none"
                        />
                        {searchQuery && <button onClick={() => setSearchQuery("")} className="text-[#B5B5B5] hover:text-[#1A1A1A]"><X size={13} /></button>}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={() => setShowSidebar(true)} className="md:hidden flex items-center gap-1.5 border border-[#E8E5E0] px-3 py-2 text-[12px] text-[#4A4A4A] hover:border-[#1A1A1A] transition-colors">
                            <Filter size={13} /> Filters
                        </button>

                        <div className="relative flex-1 sm:w-48" ref={sortRef}>
                            <button onClick={() => setIsSortOpen(!isSortOpen)} className="w-full flex items-center justify-between gap-2 border border-[#E8E5E0] px-3 py-2 text-[12px] text-[#4A4A4A] hover:border-[#1A1A1A] transition-colors">
                                <span className="flex items-center gap-1.5"><ArrowUpDown size={12} className="text-[#B5B5B5]" />{sortLabels[sortOrder]}</span>
                                <ChevronDown size={12} className={`text-[#B5B5B5] transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 mt-1 w-full bg-white border border-[#E8E5E0] shadow-lg z-30 py-1">
                                        {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((option) => (
                                            <button key={option} onClick={() => { setSortOrder(option); setIsSortOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center justify-between ${sortOrder === option ? "bg-[#F5F3F0] text-[#1A1A1A] font-medium" : "text-[#4A4A4A] hover:bg-[#F5F3F0]"}`}>
                                                {sortLabels[option]}
                                                {sortOrder === option && <Check size={12} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
                <div className="border-b border-[#E8E5E0] bg-white">
                    <div className="container mx-auto px-6 lg:px-8 py-2.5 flex flex-wrap gap-2 items-center text-[11px]">
                        {selectedCategories.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F3F0] text-[#4A4A4A] border border-[#E8E5E0]">
                                {cat} <X size={10} className="cursor-pointer text-[#B5B5B5] hover:text-[#1A1A1A]" onClick={() => toggleCategory(cat)} />
                            </span>
                        ))}
                        {selectedGenders.map(g => (
                            <span key={g} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F3F0] text-[#4A4A4A] border border-[#E8E5E0]">
                                {g} <X size={10} className="cursor-pointer text-[#B5B5B5] hover:text-[#1A1A1A]" onClick={() => toggleGender(g)} />
                            </span>
                        ))}
                        {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F3F0] text-[#4A4A4A] border border-[#E8E5E0]">
                                ${appliedMinPrice ?? 0} – ${appliedMaxPrice ?? "∞"}
                                <X size={10} className="cursor-pointer text-[#B5B5B5] hover:text-[#1A1A1A]" onClick={() => { setAppliedMinPrice(null); setAppliedMaxPrice(null); }} />
                            </span>
                        )}
                        <button onClick={clearAllFilters} className="text-[11px] text-[#8A8A8A] hover:text-[#1A1A1A] underline underline-offset-2 ml-1">Clear all</button>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 container mx-auto px-6 lg:px-8 py-8 flex gap-8 items-start">
                {/* Desktop sidebar */}
                <aside className="w-52 flex-shrink-0 hidden md:block sticky top-24 space-y-5">
                    <FilterSection title="Gender" isOpen={accordions.gender} onToggle={() => toggleAccordion("gender")}>
                        {["Men", "Women", "Kid", "Unisex"].map(gender => (
                            <FilterCheckbox key={gender} checked={selectedGenders.includes(gender)} label={gender} count={genderCounts[gender] || 0} onClick={() => toggleGender(gender)} />
                        ))}
                    </FilterSection>

                    <FilterSection title="Category" isOpen={accordions.category} onToggle={() => toggleAccordion("category")}>
                        {categories.map(category => (
                            <FilterCheckbox key={category.id} checked={selectedCategories.includes(category.name)} label={category.name} count={categoryCounts[category.name] || 0} onClick={() => toggleCategory(category.name)} />
                        ))}
                    </FilterSection>

                    <FilterSection title="Price" isOpen={accordions.price} onToggle={() => toggleAccordion("price")}>
                        {[
                            { label: "Under $50", min: null, max: 50 },
                            { label: "$50 – $100", min: 50, max: 100 },
                            { label: "$100+", min: 100, max: null }
                        ].map((range, i) => {
                            const isActive = appliedMinPrice === range.min && appliedMaxPrice === range.max;
                            return (
                                <button key={i} onClick={() => applyQuickPrice(range.min, range.max)}
                                    className={`w-full flex items-center justify-between py-1 text-[12px] transition-colors ${isActive ? "text-[#1A1A1A] font-medium" : "text-[#4A4A4A] hover:text-[#1A1A1A]"}`}>
                                    {range.label}
                                    {isActive && <Check size={12} />}
                                </button>
                            );
                        })}
                    </FilterSection>
                </aside>

                {/* Product grid */}
                <main className="flex-1 min-w-0">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-6 h-6 border-2 border-[#E8E5E0] border-t-[#1A1A1A] rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="w-8 h-8 text-[#D5D0CA] mx-auto mb-3" />
                            <p className="text-[15px] font-medium text-[#1A1A1A] mb-1">No products found</p>
                            <p className="text-[12px] text-[#8A8A8A] mb-6">Try adjusting your filters.</p>
                            <button onClick={clearAllFilters} className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[12px] font-medium hover:bg-[#333] transition-colors">
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <p className="text-[12px] text-[#8A8A8A]">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-8 md:gap-y-10">
                                {filteredProducts.map(product => (
                                    <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col">
                                        <div className="relative overflow-hidden bg-[#F0EDE8] mb-3 aspect-[3/4]">
                                            {product.stock === 0 && <div className="absolute top-2 left-2 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2 py-0.5">Sold out</div>}
                                            {product.stock > 0 && product.discountPrice && <div className="absolute top-2 left-2 z-10 bg-[#1A1A1A] text-white text-[10px] font-medium px-2 py-0.5">Sale</div>}
                                            {product.imageUrls?.[0] ? (
                                                <img src={product.imageUrls[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-[#D5D0CA]" /></div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-[#8A8A8A] tracking-wide">{product.category}</p>
                                            <h3 className="text-[12px] md:text-[13px] font-medium text-[#1A1A1A] line-clamp-1 group-hover:underline underline-offset-2 decoration-[#D5D0CA]">{product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px] text-[#1A1A1A]">${product.discountPrice || product.price}</span>
                                                {product.discountPrice && <span className="text-[11px] text-[#B5B5B5] line-through">${product.price}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile filter drawer */}
            <AnimatePresence>
                {showSidebar && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSidebar(false)} className="fixed inset-0 bg-black/40 z-[90] md:hidden" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed right-0 top-0 h-[100dvh] w-80 bg-[#FAF9F7] z-[100] md:hidden flex flex-col">
                            <div className="p-6 border-b border-[#E8E5E0] flex items-center justify-between">
                                <h2 className="text-[15px] font-medium text-[#1A1A1A]">Filters</h2>
                                <button onClick={() => setShowSidebar(false)} className="text-[#8A8A8A] hover:text-[#1A1A1A]"><X size={18} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                <FilterSection title="Gender" isOpen={true} onToggle={() => {}}>
                                    {["Men", "Women", "Kid", "Unisex"].map(gender => (
                                        <FilterCheckbox key={gender} checked={selectedGenders.includes(gender)} label={gender} count={genderCounts[gender] || 0} onClick={() => toggleGender(gender)} />
                                    ))}
                                </FilterSection>
                                <FilterSection title="Category" isOpen={true} onToggle={() => {}}>
                                    {categories.map(category => (
                                        <FilterCheckbox key={category.id} checked={selectedCategories.includes(category.name)} label={category.name} count={categoryCounts[category.name] || 0} onClick={() => toggleCategory(category.name)} />
                                    ))}
                                </FilterSection>
                                <FilterSection title="Price" isOpen={true} onToggle={() => {}}>
                                    {[{ label: "Under $50", min: null, max: 50 }, { label: "$50 – $100", min: 50, max: 100 }, { label: "$100+", min: 100, max: null }].map((range, i) => {
                                        const isActive = appliedMinPrice === range.min && appliedMaxPrice === range.max;
                                        return (
                                            <button key={i} onClick={() => { applyQuickPrice(range.min, range.max); setShowSidebar(false); }}
                                                className={`w-full flex items-center justify-between py-1 text-[12px] ${isActive ? "text-[#1A1A1A] font-medium" : "text-[#4A4A4A]"}`}>
                                                {range.label} {isActive && <Check size={12} />}
                                            </button>
                                        );
                                    })}
                                </FilterSection>
                            </div>
                            <div className="p-6 border-t border-[#E8E5E0]">
                                <button onClick={() => setShowSidebar(false)} className="w-full py-3 bg-[#1A1A1A] text-white text-[13px] font-medium hover:bg-[#333] transition-colors">
                                    Apply filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <FooterSection />
        </div>
    );
};

export default Shop;
