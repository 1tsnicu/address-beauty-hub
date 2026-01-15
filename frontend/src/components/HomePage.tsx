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
      
      {/* Hero Section - Full viewport with exact positioning */}
      <section 
        className="relative h-screen w-full flex flex-col overflow-hidden hero-section-bg"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Buttons Container - Mobile: Staggered, Desktop: Horizontal row */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          {/* Mobile: Staggered layout (scara/zig-zag) */}
          <div className="md:hidden relative w-full h-full">
            {/* Button 1 - "Magazin Online" - Left, lower position */}
            <Link 
              to="/magazin" 
              className="glossy-button absolute"
              style={{
                top: '55%',
                left: '3%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                animationDelay: '0.2s'
              }}
              aria-label={t('home.hero.shop')}
            >
              {t('home.hero.shop')}
            </Link>

            {/* Button 2 - "Cursuri" - Center, middle position */}
            <Link 
              to="/cursuri" 
              className="glossy-button absolute"
              style={{
                top: '65%',
                left: '10%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                animationDelay: '0.35s'
              }}
              aria-label={t('home.hero.courses')}
            >
              {t('home.hero.courses')}
            </Link>

            {/* Button 3 - "Contacte" - Right, lower position */}
            <Link 
              to="/contact" 
              className="glossy-button absolute"
              style={{
                top: '75%',
                right: '12%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                animationDelay: '0.5s'
              }}
              aria-label={t('home.hero.contact')}
            >
              {t('home.hero.contact')}
            </Link>
          </div>

          {/* Desktop: Horizontal row layout - positioned in bottom center */}
          <div className="hidden md:flex items-center justify-center gap-8 w-full px-8 absolute bottom-[25%] left-0 right-0 z-10">
            <Link 
              to="/magazin" 
              className="glossy-button relative"
              style={{
                animationDelay: '0.2s'
              }}
              aria-label={t('home.hero.shop')}
            >
                {t('home.hero.shop')}
            </Link>
            
            <Link 
              to="/cursuri" 
              className="glossy-button relative"
              style={{
                animationDelay: '0.35s'
              }}
              aria-label={t('home.hero.courses')}
            >
                {t('home.hero.courses')}
            </Link>
            
            <Link 
              to="/contact" 
              className="glossy-button relative"
              style={{
                animationDelay: '0.5s'
              }}
              aria-label={t('home.hero.contact')}
            >
                {t('home.hero.contact')}
            </Link>
          </div>
        </div>

        {/* Logo Section - Different positioning for mobile and desktop */}
        {/* Mobile: Bottom left - positioned below buttons */}
        <div className="md:hidden absolute bottom-[-80px] left-0 px-4 z-0 opacity-0"
          style={{
            animation: 'fadeInUp 0.7s ease-out 0.65s forwards'
          }}
        >
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="Address Beauty Logo" 
              className="w-[300px] h-[300px] object-contain"
            />
          </div>
        </div>

        {/* Desktop: Logo positioned below buttons, centered */}
        <div className="hidden md:block absolute bottom-[-5%] left-[40%] -translate-x-1/2 z-0 opacity-0"
          style={{
            animation: 'fadeInUp 0.7s ease-out 0.65s forwards'
          }}
        >
          <div className="flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="Address Beauty Logo" 
              className="w-[300px] h-[300px] object-contain drop-shadow-2xl"
            />
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