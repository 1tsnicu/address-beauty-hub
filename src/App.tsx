import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/magazin" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-bold text-primary">Magazin Online - În curând</h1></div>} />
              <Route path="/cursuri" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-bold text-primary">Cursuri Beauty - În curând</h1></div>} />
              <Route path="/livrare" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-bold text-primary">Livrare și Achitare - În curând</h1></div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="font-heading text-3xl font-bold text-primary">Contact - În curând</h1></div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
