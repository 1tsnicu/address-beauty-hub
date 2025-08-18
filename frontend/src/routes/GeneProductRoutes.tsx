import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProductsListPage } from '@/components/ProductsListPage';
import { ProductPage } from '@/components/ProductPage';

/**
 * Exemplu de configurare routing pentru sistemul de variante gene
 */
export const GeneProductRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Lista tuturor produselor gene */}
      <Route path="/gene-products" element={<ProductsListPage />} />
      
      {/* Pagina unui produs specific cu variante */}
      <Route path="/gene-product/:slug" element={<ProductPage />} />
    </Routes>
  );
};

/**
 * Exemplu de integrare în aplicația principală
 */
export const AppWithGeneProducts: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Address Beauty Hub</h1>
        </div>
      </header>
      
      <main>
        <GeneProductRoutes />
      </main>
    </div>
  );
};

// Exemple de linkuri pentru navigare
export const NavigationExample: React.FC = () => {
  return (
    <nav className="space-x-4">
      <a href="/gene-products" className="text-primary hover:underline">
        Toate produsele gene
      </a>
      <a href="/gene-product/be-perfect-black-mix-16-linii" className="text-primary hover:underline">
        Exemplu produs
      </a>
    </nav>
  );
};
