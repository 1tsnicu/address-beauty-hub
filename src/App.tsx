import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import OnlineStore from "./components/OnlineStore";
import CoursesPage from "./components/CoursesPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/magazin" element={<OnlineStore />} />
                  <Route path="/cursuri" element={<CoursesPage />} />
                  <Route path="/despre" element={<AboutPage />} />
                  <Route path="/livrare" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-bold text-primary">Livrare și Achitare - În curând</h1></div>} />
                  <Route path="/contact" element={<ContactPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
