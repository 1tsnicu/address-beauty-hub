import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, Phone } from 'lucide-react';
import heroImage from '@/assets/hero-lashes-new.jpg';
import lashesImage from '@/assets/lashes-beauty-1.jpg';
import beautyToolsImage from '@/assets/beauty-tools.jpg';
import beautyProductsImage from '@/assets/beauty-products.jpg';
import beautyCourseImage from '@/assets/beauty-course.jpg';

const HomePage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)), url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Logo */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
            {t('home.hero.title')}
          </h1>
          
          {/* Motto */}
          <p className="text-xl md:text-2xl text-foreground mb-12 font-medium">
            {t('home.hero.motto')}
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/magazin">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.shop')}
              </Button>
            </Link>
            
            <Link to="/cursuri">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <GraduationCap className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.courses')}
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                {t('home.hero.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-12 bg-gradient-to-b from-background to-light-blue/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Magazin - Visual Card */}
            <Link to="/magazin" className="group">
              <div className="card-beauty text-center h-full hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-br from-white via-light-blue/30 to-primary/10 overflow-hidden">
                <div className="relative h-32 mb-4 overflow-hidden rounded-t-lg">
                  <img 
                    src={beautyProductsImage} 
                    alt="Beauty products" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                    {t('home.hero.shop')}
                  </h3>
                  <div className="text-sm text-muted-foreground">1000+ produse</div>
                </div>
              </div>
            </Link>

            {/* Cursuri - Visual Card */}
            <Link to="/cursuri" className="group">
              <div className="card-beauty text-center h-full hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-br from-white via-light-blue/30 to-primary/10 overflow-hidden">
                <div className="relative h-32 mb-4 overflow-hidden rounded-t-lg">
                  <img 
                    src={beautyCourseImage} 
                    alt="Beauty course" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                    {t('home.hero.courses')}
                  </h3>
                  <div className="text-sm text-muted-foreground">6 programe</div>
                </div>
              </div>
            </Link>

            {/* Contact - Visual Card */}
            <Link to="/contact" className="group">
              <div className="card-beauty text-center h-full hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-br from-white via-light-blue/30 to-primary/10 overflow-hidden">
                <div className="relative h-32 mb-4 overflow-hidden rounded-t-lg">
                  <img 
                    src={lashesImage} 
                    alt="Professional lashes" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                    {t('home.hero.contact')}
                  </h3>
                  <div className="text-sm text-muted-foreground">Salon fizic</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;