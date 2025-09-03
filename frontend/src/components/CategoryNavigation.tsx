import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Link } from 'react-router-dom';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryNavigationProps {
  onSelectCategory?: (categoryId: string, subcategoryId?: string) => void;
  className?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

export function CategoryNavigation({ 
  onSelectCategory, 
  className, 
  selectedCategory = 'all',
  selectedSubcategory = ''
}: CategoryNavigationProps) {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(selectedSubcategory);

  // Update internal state when external props change
  useEffect(() => {
    setActiveCategory(selectedCategory);
    setActiveSubcategory(selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(subcategoryId);
    if (onSelectCategory) {
      onSelectCategory(categoryId, subcategoryId);
    }
  };

  // Get main categories (those without a parentId)
  const mainCategories = categories.filter(category => !category.parentId);

  // Get subcategories for a specific parent category
  const getSubcategories = (parentId: string) => {
    return categories.filter(category => category.parentId === parentId);
  };

  return (
    <nav className={cn("w-full", className)}>
      <Accordion type="single" collapsible className="w-full">
        {mainCategories.map((category) => {
          const subcategories = getSubcategories(category.id);
          const hasSubcategories = subcategories.length > 0;
          
          return (
            <AccordionItem value={category.id} key={category.id}>
              <AccordionTrigger 
                onClick={() => hasSubcategories ? null : handleCategoryClick(category.id)}
                className={cn(
                  "px-4 hover:bg-slate-100 rounded-md text-left",
                  activeCategory === category.id && !activeSubcategory && "font-bold text-primary"
                )}
              >
                {category.name}
              </AccordionTrigger>
              {hasSubcategories && (
                <AccordionContent>
                  <ul className="ml-4 space-y-1">
                    <li 
                      className={cn(
                        "px-4 py-2 hover:bg-slate-100 rounded-md cursor-pointer flex items-center",
                        activeCategory === category.id && !activeSubcategory && "font-bold text-primary"
                      )}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <ChevronRight className="h-4 w-4 mr-1" />
                      <span>Toate {category.name}</span>
                    </li>
                    {subcategories.map((subcategory) => (
                      <li 
                        key={subcategory.id} 
                        className={cn(
                          "px-4 py-2 hover:bg-slate-100 rounded-md cursor-pointer flex items-center",
                          activeSubcategory === subcategory.id && "font-bold text-primary"
                        )}
                        onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        <span>{subcategory.name}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </nav>
  );
}

export default CategoryNavigation;
