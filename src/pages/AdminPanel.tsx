import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL, authHeaders } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    LayoutDashboard, 
    PlusCircle, 
    LogOut, 
    Package, 
    Users, 
    TrendingUp,
    Store,
    Tag,
    Menu,
    Edit,
    Trash2,
    Plus,
    X,
    Upload,
    Eye,
    EyeOff,
    FileText,
    MessageSquare,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    description?: string;
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
    sizes: string[];
    stock: number;
    isVisible: boolean;
    createdAt: string;
}

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

interface CustomerUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

interface Order {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
    paymentStatus: string;
    items: OrderItem[];
}

interface DashboardStats {
    totalEarnings: number;
    totalProducts: number;
    totalCustomers: number;
    totalCategories: number;
}

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [customers, setCustomers] = useState<CustomerUser[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        totalEarnings: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalCategories: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    // Product Form State
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDiscountPrice, setProductDiscountPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productGender, setProductGender] = useState("Unisex");
    const [productStock, setProductStock] = useState("");
    const [productSizes, setProductSizes] = useState<string[]>([]);
    const [productImages, setProductImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const CATEGORIES_API = `${BASE_URL}/api/categories`;
    const PRODUCTS_API = `${BASE_URL}/api/products`;
    const MESSAGES_API = `${BASE_URL}/api/contact`;
    const USERS_API = `${BASE_URL}/api/users`;

    const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "Free Size"];

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchMessages();
        fetchCustomers();
        fetchOrders();
        fetchStats();
    }, []);

    // Polling for real-time updates based on active tab
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (activeTab === "orders") {
            interval = setInterval(() => {
                fetchOrders();
            }, 10000); // Poll every 10 seconds
        } else if (activeTab === "dashboard") {
            interval = setInterval(() => {
                fetchStats();
            }, 10000); // Poll every 10 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTab]);

    const toggleSize = (size: string) => {
        setProductSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/orders/admin/stats`, {
                headers: { ...authHeaders() }
            });
            const data = await response.json();
            if (data && !data.status) {
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORIES_API, {
                headers: { ...authHeaders() }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
            toast.error("Failed to load categories");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setProductImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            // Clean up the URL object to prevent memory leaks
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(MESSAGES_API, {
                headers: { ...authHeaders() }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            setMessages([]);
            toast.error("Failed to load messages");
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(USERS_API, {
                headers: { ...authHeaders() }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomers([]);
            toast.error("Failed to load customers");
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", productName);
            formData.append("description", productDescription);
            formData.append("price", productPrice);
            formData.append("discountPrice", productDiscountPrice);
            formData.append("category", productCategory);
            formData.append("gender", productGender);
            formData.append("stock", productStock);
            formData.append("isFeatured", "false"); 
            formData.append("sizes", JSON.stringify(productSizes));

            if (editingProduct) {
                // For editing, we also send the existing image URLs we want to keep
                formData.append("existingImages", JSON.stringify(imagePreviews.filter(url => !url.startsWith("blob:"))));
            }

            productImages.forEach(image => {
                formData.append("images", image);
            });

            const method = editingProduct ? "PUT" : "POST";
            const url = editingProduct ? `${PRODUCTS_API}/${editingProduct.id}` : PRODUCTS_API;

            const response = await fetch(url, {
                method: method,
                headers: {
                    ...authHeaders()
                },
                body: formData,
            });

            if (response.ok) {
                toast.success(editingProduct ? "Product updated successfully" : "Product published successfully");
                // Reset form
                setProductName("");
                setProductDescription("");
                setProductPrice("");
                setProductDiscountPrice("");
                setProductCategory("");
                setProductGender("Unisex");
                setProductStock("");
                setProductSizes([]);
                setProductImages([]);
                setImagePreviews([]);
                setEditingProduct(null);
                fetchProducts();
                if (editingProduct) setActiveTab("listed-products");
            } else {
                const err = await response.json();
                toast.error(`Error: ${err.message || "Failed to save product"}`);
            }
        } catch (error) {
            toast.error("Connection error");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductDescription(product.description);
        setProductPrice(product.price.toString());
        setProductDiscountPrice(product.discountPrice?.toString() || "");
        setProductCategory(product.category);
        setProductGender(product.gender);
        setProductStock(product.stock > 0 ? "1" : "0");
        setProductSizes(product.sizes || []);
        setProductImages([]);
        setImagePreviews(product.imageUrls || []);
        setActiveTab("add-products");
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductDiscountPrice("");
        setProductCategory("");
        setProductGender("Unisex");
        setProductStock("");
        setProductSizes([]);
        setProductImages([]);
        setImagePreviews([]);
        setActiveTab("listed-products");
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(PRODUCTS_API, {
                headers: { ...authHeaders() }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };

    const handleToggleVisibility = async (id: string) => {
        try {
            const response = await fetch(`${PRODUCTS_API}/${id}/toggle-visibility`, {
                method: "PATCH",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("Visibility updated");
                fetchProducts();
            } else {
                toast.error("Failed to update visibility");
            }
        } catch (error) {
            toast.error("Connection error");
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this product?")) return;

        try {
            const response = await fetch(`${PRODUCTS_API}/${id}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("Connection error");
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(CATEGORIES_API, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (response.ok) {
                toast.success("Category added successfully");
                setNewCategoryName("");
                fetchCategories();
            } else {
                toast.error("Failed to add category");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.name.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${CATEGORIES_API}/${editingCategory.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ name: editingCategory.name }),
            });

            if (response.ok) {
                toast.success("Category updated");
                setEditingCategory(null);
                fetchCategories();
            } else {
                toast.error("Failed to update category");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`${CATEGORIES_API}/${id}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("Category deleted");
                fetchCategories();
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            toast.error("Connection error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdminAuthenticated");
        toast.info("Logged out from admin panel");
        navigate("/admin");
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const response = await fetch(`${MESSAGES_API}/${id}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("Message deleted");
                fetchMessages();
            } else {
                toast.error("Failed to delete message");
            }
        } catch (error) {
            toast.error("Connection error while deleting message");
        }
    };

    const handleDeleteCustomer = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this user?")) return;

        try {
            const response = await fetch(`${USERS_API}/${id}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("User deleted");
                fetchCustomers();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            toast.error("Connection error while deleting user");
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/orders`, {
                headers: {
                    "Cache-Control": "no-cache",
                    ...authHeaders()
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };


    const handleUpdateOrderStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success(`Order set to ${status}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!confirm("Permanently delete this order?")) return;
        try {
            const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders()
                }
            });

            if (response.ok) {
                toast.success("Order deleted");
                fetchOrders();
            }
        } catch (error) {
            toast.error("Deletion failed");
        }
    };


    return (
        <div className="flex min-h-screen bg-muted/30 font-mono">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop and Mobile Drawer */}
            <aside className={`
                w-64 bg-background border-r border-border flex flex-col fixed md:sticky top-0 h-screen z-[70] transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Store className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase italic">Base Admin</span>
                    </div>
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
                        { id: "categories", label: "Categories", Icon: Tag },
                        { id: "add-products", label: "Add Products", Icon: PlusCircle },
                        { id: "listed-products", label: "Listed Products", Icon: Package },
                        { id: "messages", label: "Messages", Icon: MessageSquare, section: "Management" },
                        { id: "customers", label: "Customers", Icon: Users },
                        { id: "orders", label: "Orders", Icon: Package, section: "Storefront" }
                    ].map((item) => (
                        <div key={item.id}>
                            {item.section && (
                                <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-black text-muted-foreground/40 tracking-[0.2em]">{item.section}</div>
                            )}
                            <button 
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                            >
                                <item.Icon size={16} /> {item.label}
                            </button>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-sm text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content - Right Part */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <h2 className="font-black text-lg uppercase tracking-tighter italic">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="hidden sm:inline">Admin Session:</span>
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="font-black text-emerald-500">Active</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsContent value="dashboard" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="shadow-sm border-primary/5 bg-background/50 backdrop-blur-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-[0.2em]">Total Earnings</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black font-mono tracking-tighter italic">
                                            ${stats.totalEarnings.toLocaleString()}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
                                            <span className="text-emerald-500 inline-flex items-center gap-0.5">Live <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span></span> • Stripe Verified
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-primary/5 bg-background/50 backdrop-blur-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-[0.2em]">Products Listed</CardTitle>
                                        <Package className="h-4 w-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black font-mono tracking-tighter italic">
                                            {stats.totalProducts}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Across all categories</p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-primary/5 bg-background/50 backdrop-blur-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-[0.2em]">Total Customers</CardTitle>
                                        <Users className="h-4 w-4 text-orange-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black font-mono tracking-tighter italic">
                                            {stats.totalCustomers}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Registered accounts</p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-primary/5 bg-background/50 backdrop-blur-sm">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-[0.2em]">Total Categories</CardTitle>
                                        <Tag className="h-4 w-4 text-purple-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black font-mono tracking-tighter italic">
                                            {stats.totalCategories}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Active collections</p>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <Card className="shadow-sm border-primary/5 min-h-[300px] flex items-center justify-center border-dashed border-2">
                                <div className="text-center p-8">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <LayoutDashboard className="text-muted-foreground w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Sales Overview Chart</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">Analytics data will be populated once you have real order data.</p>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="listed-products" className="mt-0">
                            <Card className="shadow-md border-primary/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Currently Listed Products</CardTitle>
                                        <CardDescription>Manage your inventory visibility and details from this menu.</CardDescription>
                                    </div>
                                    <div className="bg-muted px-3 py-1 rounded-full text-xs font-mono font-bold">
                                        Total: {products.length}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Product</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Category</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Price</th>
                                                    <th className="p-4 text-right font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-12 text-center text-muted-foreground italic">
                                                            No products listed yet. Go to "Add Products" to get started.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product) => (
                                                        <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-md overflow-hidden border bg-muted flex-shrink-0">
                                                                        {product.imageUrls?.[0] ? (
                                                                            <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <Package className="text-muted-foreground/30 w-5 h-5" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-foreground line-clamp-1">{product.name}</div>
                                                                        <div className="text-[10px] text-muted-foreground font-mono">Stock: {product.stock > 0 ? "In Stock" : "Out of Stock"}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full uppercase tracking-tighter">
                                                                    {product.category}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="font-bold font-mono">
                                                                    ${product.discountPrice || product.price}
                                                                </div>
                                                                {product.discountPrice && (
                                                                    <div className="text-[10px] text-muted-foreground line-through italic">${product.price}</div>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button 
                                                                        onClick={() => handleEditClick(product)}
                                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                                                                        title="Edit Details"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteProduct(product.id)}
                                                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                                        title="Delete Permanently"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="messages" className="space-y-6 mt-0">
                            <Card className="shadow-md border-primary/5">
                                <CardHeader>
                                    <CardTitle>Contact Inquiries</CardTitle>
                                    <CardDescription>View messages submitted through the Contact Us page.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground whitespace-nowrap">Date</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground whitespace-nowrap">Contact</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground w-1/2">Message</th>
                                                    <th className="p-4 text-right font-mono uppercase tracking-widest text-xs text-muted-foreground">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y relative">
                                                {messages.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                            <MessageSquare className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                                            No messages found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    messages.map((msg) => (
                                                        <tr key={msg.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="p-4 align-top">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-top flex flex-col font-mono text-xs gap-1">
                                                                <span className="font-bold text-sm tracking-tight">{msg.name}</span>
                                                                <span className="text-primary truncate max-w-[150px]">{msg.email}</span>
                                                                <span className="text-muted-foreground">{msg.phone || 'N/A'}</span>
                                                            </td>
                                                            <td className="p-4 align-top">
                                                                <div className="text-xs text-muted-foreground bg-muted/30 p-3 flex-1 rounded border border-border/80 max-h-32 overflow-y-auto w-full leading-relaxed custom-scrollbar">
                                                                    {msg.message}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right align-top">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="customers" className="space-y-6 mt-0">
                            <Card className="shadow-md border-primary/5">
                                <CardHeader>
                                    <CardTitle>Registered Customers</CardTitle>
                                    <CardDescription>Manage your platform's registered users.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground whitespace-nowrap">Joined Date</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground whitespace-nowrap">Name</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground">Email</th>
                                                    <th className="p-4 text-right font-mono uppercase tracking-widest text-xs text-muted-foreground">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y relative">
                                                {customers.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                            <Users className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                                            No customers found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    customers.map((user) => (
                                                        <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="p-4 align-middle">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle font-medium">
                                                                {user.fullName}
                                                            </td>
                                                            <td className="p-4 align-middle text-muted-foreground">
                                                                {user.email}
                                                            </td>
                                                            <td className="p-4 text-right align-middle">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                                                    onClick={() => handleDeleteCustomer(user.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="categories" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Add/Edit Category Form */}
                                <Card className="shadow-md border-primary/5 h-fit">
                                    <CardHeader>
                                        <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
                                        <CardDescription>
                                            {editingCategory ? "Update the name of an existing category." : "Create a new product grouping."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Category Name</label>
                                                <Input 
                                                    value={editingCategory ? editingCategory.name : newCategoryName}
                                                    onChange={(e) => editingCategory 
                                                        ? setEditingCategory({...editingCategory, name: e.target.value}) 
                                                        : setNewCategoryName(e.target.value)
                                                    }
                                                    placeholder="e.g. Topwear" 
                                                    required 
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button type="submit" disabled={isLoading} className="flex-1">
                                                    {isLoading ? "Saving..." : (editingCategory ? "Update" : "Add Category")}
                                                </Button>
                                                {editingCategory && (
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        onClick={() => setEditingCategory(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Categories List */}
                                <Card className="lg:col-span-2 shadow-md border-primary/5">
                                    <CardHeader>
                                        <CardTitle>Existing Categories</CardTitle>
                                        <CardDescription>Manage the categories available for your products.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-md overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/50 border-b">
                                                    <tr>
                                                        <th className="p-4 text-left font-mono uppercase tracking-widest text-xs text-muted-foreground">Name</th>
                                                        <th className="p-4 text-right font-mono uppercase tracking-widest text-xs text-muted-foreground">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {categories.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={2} className="p-8 text-center text-muted-foreground italic">
                                                                No categories found. Add your first one to get started.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        categories.map((category) => (
                                                            <tr key={category.id} className="hover:bg-muted/20 transition-colors">
                                                                <td className="p-4 font-medium">{category.name}</td>
                                                                <td className="p-4 text-right space-x-2">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                                        onClick={() => setEditingCategory(category)}
                                                                    >
                                                                        <Edit size={14} />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                                                        onClick={() => handleDeleteCategory(category.id)}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="add-products" className="mt-0">
                            <Card className="shadow-lg border-primary/5 max-w-4xl">
                                <CardHeader>
                                    <CardTitle>Add New Product</CardTitle>
                                    <CardDescription>Fill in the details to list a new item on the marketplace.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-8" onSubmit={handleAddProduct}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            {/* Basic Info */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Product Title</label>
                                                    <Input 
                                                        value={productName}
                                                        onChange={(e) => setProductName(e.target.value)}
                                                        placeholder="e.g. Limited Edition T-Shirt" 
                                                        required 
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Price ($)</label>
                                                        <Input 
                                                            type="number" 
                                                            min="0"
                                                            step="0.01" 
                                                            value={productPrice}
                                                            onChange={(e) => setProductPrice(e.target.value)}
                                                            placeholder="49.99" 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Disc. Price ($)</label>
                                                        <Input 
                                                            type="number" 
                                                            min="0"
                                                            step="0.01" 
                                                            value={productDiscountPrice}
                                                            onChange={(e) => setProductDiscountPrice(e.target.value)}
                                                            placeholder="39.99" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Category</label>
                                                        <select 
                                                            value={productCategory}
                                                            onChange={(e) => setProductCategory(e.target.value)}
                                                            required
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="">Select Category</option>
                                                            {Array.isArray(categories) && categories.map(cat => (
                                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Gender</label>
                                                        <select 
                                                            value={productGender}
                                                            onChange={(e) => setProductGender(e.target.value)}
                                                            required
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="Men">Men</option>
                                                            <option value="Women">Women</option>
                                                            <option value="Kid">Kid</option>
                                                            <option value="Unisex">Unisex</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Stock Status</label>
                                                    <select 
                                                        value={productStock}
                                                        onChange={(e) => setProductStock(e.target.value)}
                                                        required
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="">Select Stock Status</option>
                                                        <option value="1">In Stock</option>
                                                        <option value="0">Out of Stock</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground block">Available Sizes</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {AVAILABLE_SIZES.map(size => (
                                                            <button
                                                                key={size}
                                                                type="button"
                                                                onClick={() => toggleSize(size)}
                                                                className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono border transition-all ${
                                                                    productSizes.includes(size)
                                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                                                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                                                }`}
                                                            >
                                                                {size}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Description</label>
                                                    <Textarea 
                                                        value={productDescription}
                                                        onChange={(e) => setProductDescription(e.target.value)}
                                                        placeholder="Describe the item features and benefits..." 
                                                        className="min-h-[120px]" 
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            {/* Image Upload */}
                                            <div className="space-y-4">
                                                <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground block">Product Images</label>
                                                
                                                <div className="grid grid-cols-3 gap-2">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                            <button 
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                                                        <Upload className="text-muted-foreground w-6 h-6" />
                                                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Add Media</span>
                                                        <input 
                                                            type="file" 
                                                            multiple 
                                                            className="hidden" 
                                                            onChange={handleImageChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground pt-2">
                                                    * You can upload multiple high-resolution images. First image will be the primary one.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button type="submit" disabled={isLoading} className="h-12 px-12 font-medium shadow-md">
                                                {isLoading ? "Publishing..." : "Publish Product"}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="orders" className="space-y-6 mt-0">
                            <Card className="shadow-md border-primary/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Customer Orders</CardTitle>
                                        <CardDescription>Track and manage your global sales and fulfillment status.</CardDescription>
                                    </div>
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-mono font-bold">
                                        Active: {orders.length}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground whitespace-nowrap">Order Info</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Customer</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Amount</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Payment</th>
                                                    <th className="p-4 text-left font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Status</th>
                                                    <th className="p-4 text-right font-mono uppercase tracking-widest text-[10px] text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y relative">
                                                {orders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                                            <Package className="w-12 h-12 opacity-10 mx-auto mb-2" />
                                                            No orders placed yet.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    orders.map((order) => (
                                                        <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="p-4 align-top">
                                                                <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase">#{order.id.split('-')[0]}</div>
                                                                <div className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                            </td>
                                                            <td className="p-4 align-top">
                                                                <div className="font-bold text-sm tracking-tight">{order.fullName}</div>
                                                                <div className="text-[10px] text-muted-foreground font-mono flex flex-col mt-1">
                                                                    <span>{order.email}</span>
                                                                    <span>{order.phone}</span>
                                                                    <span className="truncate max-w-[200px] italic">{order.address}</span>
                                                                </div>
                                                                {/* Order Items Summary */}
                                                                <div className="mt-3 grid grid-cols-1 gap-2">
                                                                    {order.items?.map((item, idx) => (
                                                                        <div key={idx} className="flex items-center gap-3 p-1.5 bg-muted/40 rounded-sm border border-border/40 hover:bg-muted/60 transition-colors">
                                                                            <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0 border border-border/20">
                                                                                <img 
                                                                                    src={item.image || "/placeholder.jpg"} 
                                                                                    alt={item.name} 
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col min-w-0">
                                                                                <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[150px]">
                                                                                    {item.name}
                                                                                </span>
                                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                                    <span className="text-[9px] font-mono text-muted-foreground bg-background px-1 rounded uppercase">SIZE: {item.size}</span>
                                                                                    <span className="text-[9px] font-mono font-bold text-primary">QTY: {item.quantity}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 align-top">
                                                                <div className="font-black font-mono text-primary text-base">${order.total.toFixed(0)}</div>
                                                            </td>
                                                            <td className="p-4 align-top">
                                                                <div className="flex flex-col gap-1.5">
                                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">
                                                                    Stripe
                                                                </span>
                                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                                                    order.paymentStatus === 'paid' 
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                                                        : order.paymentStatus === 'failed'
                                                                            ? 'bg-red-50 text-red-600 border-red-200'
                                                                            : 'bg-amber-50 text-amber-600 border-amber-200'
                                                                }`}>
                                                                    {order.paymentStatus === 'paid' ? '● Paid' : order.paymentStatus === 'failed' ? '● Failed' : '● Pending'}
                                                                </span>
                                                            </div>
                                                            </td>
                                                            <td className="p-4 align-top">
                                                                <select 
                                                                    value={order.status}
                                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 rounded border transition-all outline-none ${
                                                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                                                        order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                                                                        'bg-blue-50 text-blue-600 border-blue-200'
                                                                    }`}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="packed">Packed</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </td>
                                                            <td className="p-4 text-right align-top">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100 h-8 w-8"
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
