import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { LayoutGrid, Heart, Zap, Scissors, Brush } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LoyaltyStatusBanner from './LoyaltyStatusBanner';

const OnlineStore = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // Filter the categories to only show active ones
  const activeCategories = categories.filter(category => category.active);

  // Reusable, consistent category card
  type CategoryCardProps = {
    to: string;
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    containerClass: string; // gradients, borders, shadows
    iconClass: string;      // icon color and hover
    titleClass: string;     // title color
    subtitleClass?: string; // subtitle color
    dotClass?: string;      // small decorative dot color
    overlayFrom?: string;   // gradient overlay from-color
  };

  const CategoryCard: React.FC<CategoryCardProps> = ({
    to,
    Icon,
    title,
    subtitle,
    containerClass,
    iconClass,
    titleClass,
    subtitleClass,
    dotClass,
    overlayFrom,
  }) => (
    <Link to={to} aria-label={title} className="group transform hover:scale-[1.02] transition-all duration-300">
      <div className={`relative overflow-hidden h-48 w-64 sm:w-64 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm transition-all ${containerClass}`}>
        {dotClass ? <div className={`absolute top-3 right-3 w-3 h-3 ${dotClass} rounded-full`}></div> : null}

        {/* Consistent icon wrapper */}
        <div className="mb-4 rounded-3xl p-4 bg-white/70 backdrop-blur ring-1 ring-white/20 group-hover:bg-white/80 group-hover:ring-white/30 transition-all">
          <Icon className={`h-12 w-12 transition-colors ${iconClass}`} />
        </div>

        <span className={`text-base font-bold text-center leading-tight mb-1 ${titleClass}`}>{title}</span>
        {subtitle ? (
          <span className={`text-xs text-center opacity-90 font-medium leading-relaxed ${subtitleClass ?? ''}`}>{subtitle}</span>
        ) : null}

        <div className={`absolute inset-0 bg-gradient-to-br ${overlayFrom ?? 'from-blue-100/20'} to-transparent pointer-events-none transition-all duration-300`}></div>
      </div>
    </Link>
  );

  // Featured categories (static)
  const featuredCategories: Array<Omit<CategoryCardProps, 'Icon'> & { Icon: LucideIcon }> = [
    {
      to: '/magazin/categorie/all',
      Icon: LayoutGrid,
      title: t('store.categories.all'),
      containerClass:
        'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-700 border border-blue-300/30',
      iconClass: 'text-white group-hover:scale-110',
      titleClass: 'text-white',
      subtitle: undefined,
      subtitleClass: 'text-white/90',
      dotClass: 'bg-white/30',
      overlayFrom: 'from-white/10',
    },
    {
      to: '/magazin/categorie/lashes',
      Icon: Scissors,
      title: t('store.categories.lashes'),
      subtitle: t('store.categories.lashes.subtitle'),
      containerClass:
        'bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 hover:from-blue-100 hover:via-blue-50 hover:to-indigo-100 border-2 border-blue-200/60 hover:border-blue-300/80',
      iconClass: 'text-blue-600 group-hover:text-blue-700',
      titleClass: 'text-blue-700',
      subtitleClass: 'text-blue-500',
      dotClass: 'bg-blue-300/50',
      overlayFrom: 'from-blue-100/20',
    },
    {
      to: '/magazin/categorie/brows',
      Icon: Brush,
      title: t('store.categories.brows'),
      subtitle: t('store.categories.brows.subtitle'),
      containerClass:
        'bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 hover:from-indigo-100 hover:via-blue-100 hover:to-slate-50 border-2 border-indigo-200/60 hover:border-indigo-300/80',
      iconClass: 'text-indigo-600 group-hover:text-indigo-700',
      titleClass: 'text-indigo-700',
      subtitleClass: 'text-indigo-500',
      dotClass: 'bg-indigo-300/50',
      overlayFrom: 'from-indigo-100/20',
    },
    {
      to: '/magazin/categorie/lamination',
      Icon: Zap,
      title: t('store.categories.lamination'),
      subtitle: t('store.categories.lamination.subtitle'),
      containerClass:
        'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 hover:from-blue-100 hover:via-purple-50 hover:to-slate-100 border-2 border-purple-200/60 hover:border-purple-300/80',
      iconClass: 'text-purple-600 group-hover:text-purple-700',
      titleClass: 'text-purple-700',
      subtitleClass: 'text-purple-500',
      dotClass: 'bg-purple-300/50',
      overlayFrom: 'from-purple-100/20',
    },
    {
      to: '/magazin/categorie/cosmetics',
      Icon: Heart,
      title: t('store.categories.care'),
      subtitle: t('store.categories.care.subtitle'),
      containerClass:
        'bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-100 hover:from-cyan-100 hover:via-blue-50 hover:to-slate-100 border-2 border-cyan-200/60 hover:border-cyan-300/80',
      iconClass: 'text-cyan-600 group-hover:text-cyan-700',
      titleClass: 'text-cyan-700',
      subtitleClass: 'text-cyan-500',
      dotClass: 'bg-cyan-300/50',
      overlayFrom: 'from-cyan-100/20',
    },
  ];

  // Additional categories derived from activeCategories
  const additionalCategories = activeCategories
    .filter(
      (category) => !category.parentId && !['lashes', 'brows', 'lamination', 'cosmetics', 'all'].includes(category.id)
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global Beauty Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Hero Section Decorations */}
        <div className="absolute top-10 left-1/4 w-4 h-4 bg-blue-200/30 rounded-full animate-float"></div>
        <div className="absolute top-20 right-1/5 w-3 h-3 bg-purple-200/25 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-32 left-1/6 w-2 h-2 bg-indigo-200/35 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-16 right-1/3 w-5 h-5 bg-gradient-to-br from-blue-100/20 to-purple-100/15 rounded-full blur-sm animate-float delay-700"></div>
        
        {/* Mid-page floating elements */}
        <div className="absolute top-1/3 left-8 w-6 h-6 bg-gradient-to-br from-cyan-200/20 to-blue-200/25 rounded-full blur-md animate-sway"></div>
        <div className="absolute top-2/5 right-12 w-3 h-8 bg-gradient-to-b from-pink-200/20 to-transparent rounded-full transform rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-slate-300/30 rounded-full animate-bounce delay-200"></div>
        
        {/* Lower section decorations */}
        <div className="absolute bottom-32 left-1/5 w-5 h-5 bg-indigo-200/25 rounded-full animate-ping delay-400"></div>
        <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-blue-300/30 rounded-full animate-pulse delay-600"></div>
        <div className="absolute bottom-40 left-1/3 w-4 h-4 bg-purple-200/20 rounded-full animate-bounce delay-800"></div>
        
        {/* Elegant lines across the page */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/15 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200/10 to-transparent"></div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-8 left-8 w-8 h-8 bg-gradient-to-br from-blue-100/15 to-transparent rounded-full blur-lg"></div>
        <div className="absolute top-8 right-8 w-6 h-6 bg-gradient-to-bl from-purple-100/12 to-transparent rounded-full blur-md"></div>
        <div className="absolute bottom-8 left-8 w-10 h-10 bg-gradient-to-tr from-indigo-100/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-8 right-8 w-7 h-7 bg-gradient-to-tl from-cyan-100/18 to-transparent rounded-full blur-lg"></div>
        
        {/* Subtle texture patterns */}
        <div className="absolute top-1/6 right-1/6 w-12 h-1 bg-gradient-to-r from-blue-200/10 to-transparent rounded-full transform -rotate-45"></div>
        <div className="absolute top-5/6 left-1/6 w-10 h-1 bg-gradient-to-l from-purple-200/8 to-transparent rounded-full transform rotate-45"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-1/3 right-1/5 w-4 h-4 border border-blue-200/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-6 bg-gradient-to-b from-cyan-200/15 to-transparent rounded-full transform rotate-12 animate-sway delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
            {t('store.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {t('store.description')}
          </p>
        </div>
      </section>

      {/* Loyalty Banner - Only shown to authenticated users */}
      {isAuthenticated && (
        <section className="py-4 relative z-10">
          <div className="container mx-auto px-4">
            <LoyaltyStatusBanner />
          </div>
        </section>
      )}

      {/* Categories Grid - Beauty Premium Design */}
      <section className="py-12 bg-gradient-to-b from-slate-50/50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden z-10">
        {/* Enhanced Local Decorative Beauty Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating sparkles */}
          <div className="absolute top-20 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-32 right-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-50 animate-ping"></div>
          <div className="absolute bottom-40 left-1/5 w-4 h-4 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-40 right-1/4 w-2 h-2 bg-indigo-300 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-cyan-300 rounded-full opacity-45 animate-ping"></div>
          <div className="absolute bottom-60 right-1/5 w-3 h-3 bg-slate-300 rounded-full opacity-35 animate-bounce"></div>
          
          {/* Abstract beauty shapes */}
          <div className="absolute top-16 left-10 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-indigo-200/10 to-blue-200/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Beauty geometric patterns */}
          <div className="absolute top-24 right-20 w-8 h-8 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute bottom-32 left-16 w-6 h-6 bg-gradient-to-br from-purple-100/25 to-pink-200/25 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/3 right-1/6 w-4 h-12 bg-gradient-to-b from-cyan-100/20 to-blue-200/20 rounded-full transform rotate-12 animate-pulse delay-500"></div>
          
          {/* Elegant curves and lines */}
          <div className="absolute top-10 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent rounded-full transform -rotate-12"></div>
          <div className="absolute bottom-16 right-1/3 w-16 h-1 bg-gradient-to-r from-purple-200/25 via-pink-200/30 to-transparent rounded-full transform rotate-45"></div>
          <div className="absolute top-2/3 left-8 w-1 h-16 bg-gradient-to-b from-transparent via-indigo-200/25 to-cyan-200/30 rounded-full transform rotate-45"></div>
          
          {/* Beauty themed decorations */}
          <div className="absolute top-36 left-20 w-5 h-5 border-2 border-blue-200/40 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-48 right-32 w-3 h-8 bg-gradient-to-b from-purple-200/30 to-transparent rounded-t-full transform rotate-45 animate-pulse delay-700"></div>
          <div className="absolute top-48 right-12 w-6 h-6 bg-gradient-to-tr from-cyan-200/25 to-blue-200/30 rounded-tl-full animate-bounce delay-1000"></div>
          
          {/* Subtle texture overlays */}
          <div className="absolute top-8 left-4 w-12 h-12 bg-gradient-radial from-blue-100/10 to-transparent rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-gradient-radial from-purple-100/8 to-transparent rounded-full"></div>
          <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-gradient-radial from-indigo-100/12 to-transparent rounded-full animate-pulse delay-200"></div>
          
          {/* Floating beauty elements */}
          <div className="absolute top-28 right-1/5 w-2 h-6 bg-gradient-to-b from-pink-200/30 to-transparent rounded-full transform -rotate-12 animate-sway"></div>
          <div className="absolute bottom-36 left-1/4 w-6 h-2 bg-gradient-to-r from-blue-200/25 to-transparent rounded-full transform rotate-12 animate-sway delay-300"></div>
                  </div>
                  
        <div className="container mx-auto px-4 relative z-10">
          {/* Beauty Premium Categories Grid */}
          <div className="flex flex-col sm:flex-row sm:flex-nowrap justify-center items-center gap-4 sm:overflow-x-auto pb-4 mb-8">
            {featuredCategories.map((cfg) => (
              <CategoryCard key={cfg.to} {...cfg} />
            ))}
            </div>
            
          {additionalCategories.length > 0 && (
            <>
              {/* Visual divider and label */}
              <div className="flex items-center gap-3 max-w-4xl mx-auto mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Alte categorii</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
              </div>
              
              {/* Additional Categories Grid */}
              <div className="flex flex-col sm:flex-row sm:flex-nowrap justify-center items-center gap-4 sm:overflow-x-auto pb-4">
                {additionalCategories.map((category, index) => {
                  const beautyColors = [
                    'from-sky-50 via-blue-50 to-indigo-100 border-sky-200/60 hover:border-sky-300/80 text-sky-600 hover:shadow-sky-500/20 bg-sky-300/50',
                    'from-blue-50 via-indigo-50 to-slate-100 border-blue-200/60 hover:border-blue-300/80 text-blue-600 hover:shadow-blue-500/20 bg-blue-300/50',
                    'from-indigo-50 via-blue-50 to-purple-100 border-indigo-200/60 hover:border-indigo-300/80 text-indigo-600 hover:shadow-indigo-500/20 bg-indigo-300/50',
                    'from-slate-50 via-blue-50 to-cyan-100 border-slate-200/60 hover:border-slate-300/80 text-slate-600 hover:shadow-slate-500/20 bg-slate-300/50',
                    'from-cyan-50 via-blue-50 to-sky-100 border-cyan-200/60 hover:border-cyan-300/80 text-cyan-600 hover:shadow-cyan-500/20 bg-cyan-300/50',
                    'from-blue-50 via-slate-50 to-indigo-100 border-blue-200/60 hover:border-blue-300/80 text-blue-600 hover:shadow-blue-500/20 bg-blue-300/50',
                  ];

                  const colorSet = beautyColors[index % beautyColors.length].split(' ');
                  const [bgGradient, borderClasses, textColor, shadowColor, dotColor] = colorSet;

                  const containerClass = `bg-gradient-to-br ${bgGradient} hover:${bgGradient.replace('50', '100')} border-2 ${borderClasses} hover:shadow-2xl ${shadowColor}`;
                  const iconClass = `${textColor} group-hover:${textColor.replace('600', '700')}`;
                  const titleClass = textColor.replace('600', '700');
                  const subtitleClass = textColor.replace('600', '500');
                      
                      return (
                    <CategoryCard
                      key={category.id}
                      to={`/magazin/categorie/${category.id}`}
                      Icon={LayoutGrid}
                      title={category.name}
                      containerClass={containerClass}
                      iconClass={iconClass}
                      titleClass={titleClass}
                      subtitleClass={subtitleClass}
                      dotClass={dotColor}
                      overlayFrom="from-blue-100/20"
                    />
                  );
                  })}
                </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default OnlineStore;