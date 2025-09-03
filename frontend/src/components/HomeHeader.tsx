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
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Single row with all elements */}
        <div className="flex justify-between items-center">
          {/* Left side: Language and Currency */}
          <div className="flex items-center gap-2 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20 hover:text-white h-9 px-2 sm:px-3">
                  <Globe className="h-4 w-4" />
                  <span className="hidden xs:inline">{language}</span>
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

            <CurrencySelector className="text-white border-white/30 hover:border-white/50 focus:border-white bg-white/20 sm:bg-white/10 sm:backdrop-blur-sm" />
          </div>

          {/* Right side: Cart, Profile, and Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ShoppingCart className="text-white hover:bg-white/20 hover:text-white" />
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20 hover:text-white h-9 px-2 sm:px-3">
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
                className="gap-2 text-white hover:bg-white/20 hover:text-white h-9 px-2 sm:px-3"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t('header.account')}
                </span>
              </Button>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-white/20 hover:text-white h-9 px-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Deschide meniul</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
      </div>
      
      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </header>
  );
};

export default HomeHeader;
