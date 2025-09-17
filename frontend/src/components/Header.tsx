import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Menu, User, Globe } from 'lucide-react';
import ShoppingCart from './ShoppingCart';
import AuthModal from './AuthModal';
import CurrencySelector from './CurrencySelector';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: t('header.home'), path: '/' },
    { name: t('header.shop'), path: '/magazin' },
    { name: t('header.courses'), path: '/cursuri' },
    { name: t('header.about'), path: '/despre' },
    { name: t('header.delivery'), path: '/livrare' },
    { name: t('header.contact'), path: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Top bar with language selector and account */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
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
          <div className="flex items-center gap-2 sm:gap-4">
            <CurrencySelector />
            <ShoppingCart />
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {user.name}
                      {user.discountPercentage > 0 && (
                        <span className="ml-1 text-xs bg-primary/20 text-primary px-1 py-0.5 rounded-full">
                          {user.discountPercentage}%
                        </span>
                      )}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="flex flex-col items-start">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="flex flex-col items-start">
                    <span className="text-xs">Nivel fidelitate: {user.loyaltyLevel}</span>
                    <span className="text-xs">Reducere: {user.discountPercentage}%</span>
                    <span className="text-xs">Total achiziții: {user.totalSpent.toLocaleString()} LEI</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAuthModalOpen(true)}>
                    Contul meu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Deconectare
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t('header.account')}
                </span>
              </Button>
            )}
            
            <AuthModal 
              open={authModalOpen}
              onOpenChange={setAuthModalOpen}
            />
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between">
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
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Central Logo and motto */}
          <div className="flex flex-col items-center">
            <Link to="/" className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              Adress Beauty
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {t('header.motto')}
            </p>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Deschide meniul</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="font-heading text-primary">Adress Beauty</SheetTitle>
                <SheetDescription>
                  {t('header.motto')}
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
                    {item.name}
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