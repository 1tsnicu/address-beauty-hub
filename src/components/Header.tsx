import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, Globe, ShoppingBag } from 'lucide-react';

const Header = () => {
  const [language, setLanguage] = useState('RO');
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: 'Acasă', path: '/', nameRu: 'Главная' },
    { name: 'Magazin online', path: '/magazin', nameRu: 'Онлайн магазин' },
    { name: 'Cursuri', path: '/cursuri', nameRu: 'Курсы' },
    { name: 'Livrare / Achitare', path: '/livrare', nameRu: 'Доставка / Оплата' },
    { name: 'Contact', path: '/contact', nameRu: 'Контакт' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Top bar with language selector and account */}
        <div className="flex justify-between items-center mb-4">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {language}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setLanguage('RO')}>
                Română
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('RU')}>
                Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Coș</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Contul meu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Înregistrare
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Autentificare
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between">
          {/* Logo and motto */}
          <div className="flex flex-col">
            <Link to="/" className="font-heading text-2xl md:text-3xl font-bold text-primary">
              Adress Beauty
            </Link>
            <p className="text-sm text-muted-foreground hidden md:block">
              Inspirație, educație și produse într-un singur loc!
            </p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-foreground'
                }`}
              >
                {language === 'RO' ? item.name : item.nameRu}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Deschide meniul</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="font-heading text-primary">Adress Beauty</SheetTitle>
                <SheetDescription>
                  Inspirație, educație și produse într-un singur loc!
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {language === 'RO' ? item.name : item.nameRu}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;