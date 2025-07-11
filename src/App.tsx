import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";
import HomePage from "./components/HomePage";
import OnlineStore from "./components/OnlineStore";
import CoursesPage from "./components/CoursesPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import DeliveryPage from "./components/DeliveryPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <CategoriesProvider>
              <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/magazin" element={<OnlineStore />} />
                  <Route path="/cursuri" element={<CoursesPage />} />
                  <Route path="/despre" element={<AboutPage />} />
                  <Route path="/livrare" element={<DeliveryPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/termeni" element={<TermsPage />} />
                  <Route path="/confidentialitate" element={<PrivacyPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <BackToTopButton />
            </div>
          </BrowserRouter>
            </TooltipProvider>
            </CategoriesProvider>
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
