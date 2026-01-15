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

const HomeHeader = () => {
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
    <header className="fixed top-0 left-0 right-0 z-[1000] h-20 bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px] border-b border-[rgba(0,0,0,0.05)] animate-slide-down">
      <div className="container mx-auto px-5 h-full flex items-center">
        {/* Single row with all elements */}
        <div className="flex justify-between items-center">
          {/* Left side: Language and Currency */}
          <div className="flex items-center gap-2 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.05)] h-9 px-2 sm:px-3">
                  <Globe className="h-6 w-6" />
                  <span className="hidden xs:inline text-base font-medium">{language}</span>
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

            <CurrencySelector className="text-[rgba(0,0,0,0.7)] border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.2)] focus:border-[rgba(0,0,0,0.3)] bg-transparent" />
          </div>

          {/* Right side: Cart, Profile, and Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.05)] rounded-full p-2 transition-colors">
              <ShoppingCart className="text-[rgba(0,0,0,0.7)] hover:text-[rgba(0,0,0,0.9)]" />
            </div>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.05)] h-9 px-2 sm:px-3">
                    <User className="h-6 w-6" />
                    <span className="hidden sm:inline">
                      {user.name}
                      {(user.discountPercentage || 0) > 0 && (
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
                    <span className="text-xs">Nivel fidelitate: {user.loyaltyLevel || 0}</span>
                    <span className="text-xs">Reducere: {user.discountPercentage || 0}%</span>
                    <span className="text-xs">Total achiziții: {(user.totalSpent || 0).toLocaleString('ro-RO')} LEI</span>
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
                className="gap-2 text-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.05)] h-9 px-2 sm:px-3"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:inline">
                  {t('header.account')}
                </span>
              </Button>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.05)] h-9 px-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Deschide meniul</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-heading text-primary">Address Beauty</SheetTitle>
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
      </div>
      
      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </header>
  );
};

export default HomeHeader;
