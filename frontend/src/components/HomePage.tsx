import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, Phone, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import HomeHeader from './HomeHeader';
import heroImage from '@/assets/hero-lashes-new.jpg';
import beautyProductsImage from '@/assets/beauty-products.jpg';
import beautyCourseImage from '@/assets/beauty-course.jpg';
import lashesImage from '@/assets/lashes-beauty-1.jpg';

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
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Overlay layer with responsive blur and opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 sm:from-white/30 sm:via-white/20 sm:to-white/10"></div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent sm:from-white/50 sm:via-white/30 sm:to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Logo */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
            {t('home.hero.title')}
          </h1>
          
          {/* Motto */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold mb-12 max-w-3xl mx-auto drop-shadow-lg">
            {t('home.hero.motto')}
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-2xl mx-auto">
            <Link to="/magazin" className="w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="hero" 
                className="group w-full sm:w-[280px] shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.shop')}
              </Button>
            </Link>
            
            <Link to="/cursuri" className="w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="hero" 
                className="group w-full sm:w-[280px] shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <GraduationCap className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.courses')}
              </Button>
            </Link>
            
            <Link to="/contact" className="w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="hero" 
                className="group w-full sm:w-[280px] shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Carousel Section */}
      <section className="py-16 bg-gradient-to-b from-background to-light-blue/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Descoperă Ofertele Noastre
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Promoții exclusive, produse noi și conținut educațional pentru a-ți îmbunătăți experiența de frumusețe
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
                          {item.type === 'promotion' ? 'Promoție' : 
                           item.type === 'new-product' ? 'Produs Nou' : 'Video'}
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