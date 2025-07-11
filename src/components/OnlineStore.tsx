import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductGrid from './ProductGrid';
import Newsletter from './Newsletter';

const OnlineStore = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toate produsele' },
    { id: 'lashes', name: 'Gene' },
    { id: 'brows', name: 'Sprâncene' },
    { id: 'lamination', name: 'Laminarea' },
    { id: 'cosmetics', name: 'Cosmetice & îngrijire personală' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Noutăți' },
    { value: 'price-low', label: 'Preț crescător' },
    { value: 'price-high', label: 'Preț descrescător' },
    { value: 'popular', label: 'Cele mai vândute' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Magazin Online
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Descoperă produse profesionale pentru gene false de cea mai înaltă calitate
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Caută produse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort and Filter */}
            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtrează
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProductGrid searchTerm={searchTerm} category={selectedCategory} sortBy={sortBy} />
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default OnlineStore;