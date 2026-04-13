import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import Shop from "./pages/Shop.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import Auth from "./pages/Auth.tsx";
import Checkout from "./pages/Checkout.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import UserProtectedRoute from "./components/auth/UserProtectedRoute.tsx";
import { CartProvider } from "./context/CartContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin-panel" element={<AdminPanel />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route element={<UserProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<MyOrders />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
