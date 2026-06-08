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
    CheckCircle2,
    Palette,
    GripVertical,
    Image as ImageIcon,
    HelpCircle,
    Star
} from "lucide-react";
import { toast } from "sonner";
import { AdminFaqs } from "@/components/admin/AdminFaqs";
import { AdminReviews } from "@/components/admin/AdminReviews";

interface Category {
    id: string;
    name: string;
    description?: string;
}

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
    sizes: string[];
    customFields?: CustomField[];
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
    color?: string;
    variantInfo?: string;
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
    statusMessage?: string;
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
    const [sizesInputText, setSizesInputText] = useState("");
    const [productImages, setProductImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const [productColors, setProductColors] = useState<{name: string, code: string}[]>([]);
    const [fieldInputTexts, setFieldInputTexts] = useState<Record<string, string>>({});
    const [orderMessages, setOrderMessages] = useState<Record<string, string>>({});

    const SETTINGS_API = `${BASE_URL}/api/settings`;
    const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
    const [uploadingSetting, setUploadingSetting] = useState<string | null>(null);

    const CATEGORIES_API = `${BASE_URL}/api/categories`;
    const PRODUCTS_API = `${BASE_URL}/api/products`;
    const MESSAGES_API = `${BASE_URL}/api/contact`;
    const USERS_API = `${BASE_URL}/api/users`;

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchMessages();
        fetchCustomers();
        fetchOrders();
        fetchStats();
        fetchSettings();
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

    // Custom Fields Handlers
    const addCustomField = () => {
        const newField: CustomField = {
            id: crypto.randomUUID(),
            name: '',
            type: 'text',
            values: [],
        };
        setCustomFields(prev => [...prev, newField]);
    };

    const removeCustomField = (fieldId: string) => {
        setCustomFields(prev => prev.filter(f => f.id !== fieldId));
        setFieldInputTexts(prev => { const n = {...prev}; delete n[fieldId]; return n; });
    };

    const updateCustomFieldName = (fieldId: string, name: string) => {
        setCustomFields(prev => prev.map(f => f.id === fieldId ? { ...f, name } : f));
    };

    const addColor = (colorCode: string, colorName: string) => {
        if (!colorName.trim()) return;
        setProductColors(prev => [...prev, { name: colorName.trim(), code: colorCode }]);
    };

    const removeColor = (index: number) => {
        setProductColors(prev => prev.filter((_, i) => i !== index));
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

            // Build merged customFields: colors (dedicated) + text fields
            const mergedFields: CustomField[] = [];
            if (productColors.length > 0) {
                mergedFields.push({
                    id: 'colors-field',
                    name: 'Colors',
                    type: 'color',
                    values: productColors.map(c => c.name),
                    colorCodes: productColors.map(c => c.code),
                });
            }
            customFields.forEach(f => {
                if (f.name.trim() && f.values.length > 0) {
                    mergedFields.push(f);
                }
            });
            formData.append("customFields", JSON.stringify(mergedFields));

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
                setSizesInputText("");
                setProductImages([]);
                setImagePreviews([]);
                setCustomFields([]);
                setProductColors([]);
                setFieldInputTexts({});
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
        setSizesInputText((product.sizes || []).join(', '));

        // Separate colors from text fields
        const existingFields = product.customFields || [];
        const colorField = existingFields.find(f => f.type === 'color');
        if (colorField) {
            setProductColors(colorField.values.map((name, i) => ({
                name,
                code: colorField.colorCodes?.[i] || '#000000'
            })));
        } else {
            setProductColors([]);
        }
        const textFields = existingFields.filter(f => f.type !== 'color');
        setCustomFields(textFields);
        const texts: Record<string, string> = {};
        textFields.forEach(f => { texts[f.id] = f.values.join(', '); });
        setFieldInputTexts(texts);

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
        setSizesInputText("");
        setCustomFields([]);
        setProductColors([]);
        setFieldInputTexts({});
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

    const fetchSettings = async () => {
        try {
            const res = await fetch(SETTINGS_API);
            const data = await res.json();
            if (data?.data) {
                setSiteSettings(data.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleSettingImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingSetting(key);
        try {
            const formData = new FormData();
            formData.append("image", file);
            
            const uploadRes = await fetch(`${SETTINGS_API}/upload`, {
                method: "POST",
                headers: { ...authHeaders() },
                body: formData
            });
            const { url } = await uploadRes.json();
            
            if (url) {
                // Update settings
                const newSettings = { [key]: url };
                const updateRes = await fetch(SETTINGS_API, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeaders()
                    },
                    body: JSON.stringify({ settings: newSettings })
                });
                
                if (updateRes.ok) {
                    setSiteSettings(prev => ({ ...prev, [key]: url }));
                    toast.success("Image updated successfully");
                } else {
                    toast.error("Failed to save image URL to settings");
                }
            } else {
                toast.error("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during upload");
        } finally {
            setUploadingSetting(null);
            // Reset input
            e.target.value = '';
        }
    };


    const handleUpdateOrderStatus = async (id: string, status: string, customMessageOverride?: string) => {
        try {
            const finalMessage = customMessageOverride !== undefined ? customMessageOverride : (orderMessages[id] !== undefined ? orderMessages[id] : undefined);
            
            const response = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    ...authHeaders()
                },
                body: JSON.stringify({ 
                    status, 
                    ...(finalMessage !== undefined && finalMessage.trim() ? { statusMessage: finalMessage.trim() } : { statusMessage: "" }) 
                })
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
        <div className="flex min-h-screen bg-[#FAF9F7] text-foreground font-sans">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop and Mobile Drawer */}
            <aside className={`
                w-64 bg-white border-r border-[#E8E5E0] flex flex-col fixed md:sticky top-0 h-screen z-[70] transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 border-b border-[#E8E5E0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center shrink-0">
                            <Store className="text-white w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[15px] text-[#1A1A1A]">Base Admin</span>
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
                        { id: "orders", label: "Orders", Icon: Package, section: "Storefront" },
                        { id: "storefront", label: "Storefront Layout", Icon: ImageIcon },
                        { id: "faqs", label: "FAQs", Icon: HelpCircle },
                        { id: "reviews", label: "Reviews", Icon: Star }
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
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-[12px] font-medium transition-all ${activeTab === item.id ? "bg-[#1A1A1A] text-white" : "text-[#6B6B6B] hover:bg-[#F5F3F0] hover:text-[#1A1A1A]"}`}
                            >
                                <item.Icon size={16} /> {item.label}
                            </button>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#E8E5E0] mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-[12px] font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content - Right Part */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="h-14 border-b border-[#E8E5E0] bg-white sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#F5F3F0] rounded transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="font-medium text-[15px] text-[#1A1A1A] capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8A8A8A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        <span>Active</span>
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
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (Number(val) < 0) return;
                                                                setProductPrice(val);
                                                            }}
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
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (Number(val) < 0) return;
                                                                setProductDiscountPrice(val);
                                                            }}
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
                                                {/* Sizes — typed comma separated */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground block">Available Sizes</label>
                                                    <Input
                                                        value={sizesInputText}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setSizesInputText(val);
                                                            if (val.trim() === '') {
                                                                setProductSizes([]);
                                                            } else {
                                                                setProductSizes(val.split(',').map(s => s.trim()).filter(Boolean));
                                                            }
                                                        }}
                                                        placeholder="e.g. S, M, L, XL, XXL, Free Size"
                                                    />
                                                    {productSizes.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                            {productSizes.map((size, i) => (
                                                                <span key={i} className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-primary/10 text-primary border border-primary/20">
                                                                    {size}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Dedicated Colors Field */}
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Available Colors</label>
                                                    </div>
                                                    
                                                    <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                                                        <div className="flex items-end gap-3">
                                                            <div className="space-y-1 flex-shrink-0">
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pick Color</span>
                                                                <input
                                                                    type="color"
                                                                    id="main-color-picker"
                                                                    defaultValue="#000000"
                                                                    className="w-10 h-10 rounded-lg border border-border cursor-pointer block"
                                                                />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Color Name</span>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        id="main-color-name"
                                                                        placeholder="e.g. Midnight Black"
                                                                        className="h-10 text-sm"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                const picker = document.getElementById("main-color-picker") as HTMLInputElement;
                                                                                const nameInput = e.target as HTMLInputElement;
                                                                                addColor(picker.value, nameInput.value);
                                                                                nameInput.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-10 px-3"
                                                                        onClick={() => {
                                                                            const picker = document.getElementById("main-color-picker") as HTMLInputElement;
                                                                            const nameInput = document.getElementById("main-color-name") as HTMLInputElement;
                                                                            addColor(picker.value, nameInput.value);
                                                                            nameInput.value = '';
                                                                        }}
                                                                    >
                                                                        <Plus size={14} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Added Colors List */}
                                                        {productColors.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 pt-1">
                                                                {productColors.map((color, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold group/color hover:border-red-200 transition-colors"
                                                                    >
                                                                        <span
                                                                            className="w-4 h-4 rounded-full border border-zinc-300 flex-shrink-0 shadow-inner"
                                                                            style={{ backgroundColor: color.code }}
                                                                        />
                                                                        <span>{color.name}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeColor(i)}
                                                                            className="ml-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                                                                        >
                                                                            <X size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Dynamic Custom Fields */}
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-medium font-mono uppercase tracking-widest text-muted-foreground">Additional Attributes</label>
                                                    </div>

                                                    {/* Existing Custom Fields */}
                                                    {customFields.map((field) => (
                                                        <div key={field.id} className="border border-border rounded-xl p-4 space-y-3 bg-muted/20 relative group">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCustomField(field.id)}
                                                                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <X size={14} />
                                                            </button>

                                                            {/* Field Name */}
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                    <GripVertical size={14} className="text-primary" />
                                                                </div>
                                                                <Input
                                                                    value={field.name}
                                                                    onChange={(e) => updateCustomFieldName(field.id, e.target.value)}
                                                                    placeholder="Field name (e.g. Material, Style)"
                                                                    className="h-9 text-sm font-bold"
                                                                />
                                                            </div>

                                                            {/* Text-type field: comma separated input */}
                                                            <div className="space-y-2">
                                                                <Input
                                                                    value={fieldInputTexts[field.id] || ''}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        setFieldInputTexts(prev => ({ ...prev, [field.id]: val }));
                                                                        
                                                                        const values = val.split(',').map(v => v.trim()).filter(Boolean);
                                                                        setCustomFields(prev => prev.map(f => f.id === field.id ? { ...f, values } : f));
                                                                    }}
                                                                    placeholder="Enter comma-separated values (e.g. Cotton, Polyester, Linen)"
                                                                    className="text-sm"
                                                                />
                                                                {field.values.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {field.values.map((val, i) => (
                                                                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-100 text-zinc-600 border border-zinc-200">
                                                                                {val}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Add Field Buttons */}
                                                    <div className="flex gap-2 flex-wrap">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-xs font-bold gap-1.5"
                                                            onClick={addCustomField}
                                                        >
                                                            <Plus size={14} /> Add Custom Field
                                                        </Button>
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
                                                                    {order.items?.map((item, idx) => {
                                                                        let customFieldsData: Record<string, string> = {};
                                                                        try {
                                                                            customFieldsData = item.variantInfo ? JSON.parse(item.variantInfo) : {};
                                                                        } catch (e) {
                                                                            // ignore parse errors
                                                                        }

                                                                        return (
                                                                            <div key={idx} className="flex gap-3 p-2 bg-muted/40 rounded-md border border-border/40 hover:bg-muted/60 transition-colors">
                                                                                <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0 border border-border/20">
                                                                                    <img 
                                                                                        src={item.image || "/placeholder.jpg"} 
                                                                                        alt={item.name} 
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col min-w-0 flex-1">
                                                                                    <div className="flex justify-between items-start">
                                                                                        <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1 pr-2">
                                                                                            {item.name}
                                                                                        </span>
                                                                                        <span className="text-[10px] font-mono font-bold text-primary shrink-0">
                                                                                            x{item.quantity}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                                                        <span className="text-[9px] font-mono font-semibold text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                                                                                            <span className="opacity-50">SIZE:</span> {item.size}
                                                                                        </span>
                                                                                        {item.color && (
                                                                                            <span className="text-[9px] font-mono font-semibold text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                                                                                                <span className="opacity-50">COLOR:</span> {item.color}
                                                                                            </span>
                                                                                        )}
                                                                                        {Object.entries(customFieldsData).map(([key, value]) => (
                                                                                            <span key={key} className="text-[9px] font-mono font-semibold text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                                                                                                <span className="opacity-50">{key}:</span> {value}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
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
                                                                <div className="flex flex-col gap-2 items-start">
                                                                    <div className="flex flex-col gap-1.5 w-full max-w-[160px]">
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
                                                                        
                                                                        <div className="flex flex-col gap-1">
                                                                            <input 
                                                                                type="text"
                                                                                placeholder="Custom message..."
                                                                                value={orderMessages[order.id] !== undefined ? orderMessages[order.id] : (order.statusMessage || "")}
                                                                                onChange={(e) => setOrderMessages(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                                                className="text-[9px] px-2 py-1.5 rounded border border-border/50 bg-background w-full outline-none focus:border-primary/50"
                                                                            />
                                                                            {(orderMessages[order.id] !== undefined && orderMessages[order.id] !== (order.statusMessage || "")) && (
                                                                                <button 
                                                                                    onClick={() => handleUpdateOrderStatus(order.id, order.status, orderMessages[order.id])}
                                                                                    className="bg-primary text-primary-foreground text-[9px] py-1 px-2 rounded font-bold hover:opacity-90 transition-all self-end"
                                                                                >
                                                                                    Save Message
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
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

                        <TabsContent value="storefront" className="space-y-6 mt-0">
                            <Card className="shadow-md border-primary/5">
                                <CardHeader>
                                    <CardTitle>Storefront Images</CardTitle>
                                    <CardDescription>Manage the hero slideshow banners and purpose poster image.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { key: 'banner_image_1', label: 'Slideshow Banner 1', rec: '1920x1080px' },
                                            { key: 'banner_image_2', label: 'Slideshow Banner 2', rec: '1920x1080px' },
                                            { key: 'banner_image_3', label: 'Slideshow Banner 3', rec: '1920x1080px' },
                                            { key: 'purpose_image', label: 'Our Purpose Poster', rec: '800x1200px' }
                                        ].map((setting) => (
                                            <div key={setting.key} className="border border-border/60 p-4 rounded-md bg-muted/10 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-black text-sm uppercase tracking-tighter">{setting.label}</h3>
                                                    {uploadingSetting === setting.key && (
                                                        <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">Uploading...</span>
                                                    )}
                                                </div>
                                                
                                                <div className="aspect-video w-full bg-muted rounded-md border border-border/40 overflow-hidden relative group flex items-center justify-center">
                                                    {siteSettings[setting.key] ? (
                                                        <img 
                                                            src={siteSettings[setting.key]} 
                                                            alt={setting.label} 
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-muted-foreground opacity-50 p-4">
                                                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                                            <span className="text-xs font-bold uppercase tracking-widest">No Image Set</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <label className="cursor-pointer bg-[#1A1A1A] hover:bg-[#333] px-4 py-2 text-xs font-medium text-white transition-colors">
                                                            Upload New Image
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*"
                                                                onChange={(e) => handleSettingImageUpload(setting.key, e)}
                                                                disabled={uploadingSetting === setting.key}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">Recommended size: {setting.rec}. Format: JPG, PNG, WEBP.</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="faqs" className="space-y-6 mt-0">
                            <AdminFaqs />
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-6 mt-0">
                            <AdminReviews />
                        </TabsContent>

                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
