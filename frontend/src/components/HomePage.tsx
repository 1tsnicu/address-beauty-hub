import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, Phone, MapPin, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import HomeHeader from './HomeHeader';
import heroImage from '@/assets/2025-12-23 10.12.32.jpg';
import beautyProductsImage from '@/assets/beauty-products.jpg';
import beautyCourseImage from '@/assets/beauty-course.jpg';
import lashesImage from '@/assets/lashes-beauty-1.jpg';
import logoImage from '@/assets/primul.png';

const HomePage = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data
  const carouselItems = [
    {
      type: 'promotion',
      image: beautyProductsImage,
      title: 'Promoție Specială',
      subtitle: 'Reduceri de până la 50%',
      description: 'Descoperă produsele noastre premium la prețuri incredibile',
      cta: 'Vezi ofertele',
      link: '/magazin'
    },
    {
      type: 'new-product',
      image: lashesImage,
      title: 'Produse Noi',
      subtitle: 'Colecția de toamnă',
      description: 'Cele mai noi produse pentru îngrijirea genelelor',
      cta: 'Explorează',
      link: '/magazin'
    },
    {
      type: 'video',
      image: beautyCourseImage,
      title: 'Cursuri Video',
      subtitle: 'Învață de la profesioniști',
      description: 'Tutoriale video pentru tehnici de machiaj profesionale',
      cta: 'Începe cursul',
      link: '/cursuri'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* HomeHeader */}
      <HomeHeader />
      
      {/* Hero Section - Split Screen Design for Desktop */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Mobile: Optimized Premium Design */}
        <div className="md:hidden relative h-screen w-full overflow-hidden">
          {/* Background Image with enhanced filter */}
          <img 
            src={heroImage} 
            alt="Address Beauty Model" 
            className="absolute inset-0 w-full h-full object-cover object-center-top hero-mobile-bg"
            style={{
              filter: 'brightness(1.05) contrast(1.1)'
            }}
          />
          
          {/* Enhanced Overlay Gradient */}
          <div 
            className="absolute inset-0 z-10 hero-mobile-overlay"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.5) 100%)'
            }}
          />

          {/* Buttons Container - Vertical Layout */}
          <div className="absolute bottom-[180px] left-0 right-0 px-[30px] flex flex-col gap-4 z-50">
            {/* Button 1: Magazin Online */}
            <Link 
              to="/magazin" 
              className="hero-mobile-button hero-button-1 w-full h-[65px] rounded-full flex items-center justify-center font-bold text-lg text-white relative overflow-hidden"
              aria-label={t('home.hero.shop')}
            >
              <span style={{ 
                fontFamily: "'Inter', sans-serif", 
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {t('home.hero.shop')}
              </span>
            </Link>

            {/* Button 2: Cursuri Profesionale */}
            <Link 
              to="/cursuri" 
              className="hero-mobile-button hero-button-2 w-full h-[65px] rounded-full flex items-center justify-center font-bold text-lg text-white relative overflow-hidden"
              aria-label={t('home.hero.courses')}
            >
              <span style={{ 
                fontFamily: "'Inter', sans-serif", 
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {t('home.hero.courses')}
              </span>
            </Link>

            {/* Button 3: Contacte */}
            <Link 
              to="/contact" 
              className="hero-mobile-button hero-button-3 w-full h-[65px] rounded-full flex items-center justify-center font-bold text-lg text-white relative overflow-hidden"
              aria-label={t('home.hero.contact')}
            >
              <span style={{ 
                fontFamily: "'Inter', sans-serif", 
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {t('home.hero.contact')}
              </span>
            </Link>
          </div>

          {/* Logo Bottom - Optimized */}
          <div 
            className="absolute bottom-[40px] left-0 right-0 flex justify-center items-center z-50 hero-mobile-logo"
          >
            <img 
              src={logoImage} 
              alt="Address Beauty Logo" 
              className="max-w-[450px] max-h-[180px] w-auto h-auto hero-logo-image"
            />
          </div>
        </div>

        {/* Desktop: Split Screen Layout (50% / 50%) - Stylized Premium */}
        <div className="hidden md:flex h-full w-full relative">
          {/* Left: Image Section (50%) */}
          <div className="relative w-1/2 h-full overflow-hidden group">
            <img 
              src={heroImage} 
              alt="Address Beauty Model" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              style={{
                animation: 'slideInLeft 1s ease-out'
              }}
            />
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent"></div>
            {/* Decorative accent line */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
          </div>

          {/* Right: Content Section (50%) */}
          <div className="w-1/2 h-full bg-gradient-to-br from-white via-gray-50/50 to-white flex items-center justify-center relative overflow-hidden">
            {/* Elegant Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(214 100% 60%) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
            
            {/* Decorative gradient circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/3 to-transparent rounded-full blur-3xl"></div>
            
            {/* Content Container */}
            <div className="relative z-10 max-w-lg w-full px-16 hero-content-card-styled">
              {/* Logo at top with animation */}
              <div className="mb-14 flex justify-center opacity-0" style={{
                animation: 'fadeInDown 0.8s ease-out 0.2s forwards'
              }}>
                <div className="relative">
                  <img 
                    src={logoImage} 
                    alt="Address Beauty Logo" 
                    className="h-28 w-auto object-contain drop-shadow-lg"
                  />
                  {/* Decorative dot */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                </div>
              </div>

              {/* Headline with gradient text effect */}
              <h1 
                className="text-7xl font-bold text-center leading-[1.05] mb-8 opacity-0 hero-headline"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  animation: 'fadeInUp 0.8s ease-out 0.4s forwards'
                }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Descoperă frumusețea ta naturală
                </span>
              </h1>
              
              {/* Elegant divider */}
              <div className="flex items-center justify-center gap-3 mb-10 opacity-0" style={{
                animation: 'fadeInUp 0.6s ease-out 0.6s forwards'
              }}>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent"></div>
              </div>
              
              {/* Tagline with elegant styling */}
              <p 
                className="text-2xl text-gray-600 text-center mb-14 font-light italic opacity-0"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  animation: 'fadeInUp 0.6s ease-out 0.8s forwards'
                }}
              >
                Aici, ne vedem, zi de zi!
              </p>

              {/* Buttons Container - Enhanced */}
              <div className="space-y-5 mb-14">
                <Link 
                  to="/magazin" 
                  className="hero-action-button-styled block w-full rounded-xl transition-all duration-500 flex items-center justify-center group relative overflow-hidden"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 1s backwards'
                  }}
                  aria-label={t('home.hero.shop')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <ShoppingBag className="w-5 h-5 mr-3 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-lg font-semibold text-white relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t('home.hero.shop')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>

                <Link 
                  to="/cursuri" 
                  className="hero-action-button-styled block w-full rounded-xl transition-all duration-500 flex items-center justify-center group relative overflow-hidden"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 1.2s backwards'
                  }}
                  aria-label={t('home.hero.courses')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <GraduationCap className="w-5 h-5 mr-3 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-lg font-semibold text-white relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t('home.hero.courses')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>

                <Link 
                  to="/contact" 
                  className="hero-action-button-styled block w-full rounded-xl transition-all duration-500 flex items-center justify-center group relative overflow-hidden"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 1.4s backwards'
                  }}
                  aria-label={t('home.hero.contact')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Phone className="w-5 h-5 mr-3 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-lg font-semibold text-white relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t('home.hero.contact')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>

              {/* Enhanced Footer */}
              <div className="text-center opacity-0" style={{
                animation: 'fadeInUp 0.6s ease-out 1.6s forwards'
              }}>
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Address beauty
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-yellow-400 text-sm">⭐</span>
                </div>
                <p className="text-xs text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  2000+ clienți mulțumiți
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Carousel Section */}
      <section className="py-16 bg-gradient-to-b from-background to-light-blue/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('home.carousel.title')}
            </h2>
            <p className="text-lg text-[#1a1a1a] max-w-2xl mx-auto">
              {t('home.carousel.description')}
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Slides */}
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                      ? '-translate-x-full opacity-0'
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="relative h-full">
                    {/* Background Image */}
                  <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        {item.type === 'video' && (
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-medium bg-primary/80 px-3 py-1 rounded-full">
                          {item.type === 'promotion' ? t('home.carousel.promotion') : 
                           item.type === 'new-product' ? t('home.carousel.new-product') : t('home.carousel.video')}
                        </span>
                </div>
                      
                      <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                        {item.title}
                  </h3>
                      
                      <p className="text-lg md:text-xl font-medium text-white/90 mb-2">
                        {item.subtitle}
                      </p>
                      
                      <p className="text-white/80 mb-6 max-w-md">
                        {item.description}
                      </p>
                      
                      <Link to={item.link}>
                        <Button 
                          variant="default" 
                          size="lg"
                          className="bg-white text-primary hover:bg-white/90 font-semibold"
                        >
                          {item.cta}
                        </Button>
                      </Link>
                </div>
              </div>
                </div>
              ))}
                </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-primary scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;