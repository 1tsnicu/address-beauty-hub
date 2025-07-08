import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, Phone } from 'lucide-react';
import heroImage from '@/assets/hero-beauty.jpg';

const HomePage = () => {
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
            Adress Beauty
          </h1>
          
          {/* Motto */}
          <p className="text-xl md:text-2xl text-foreground mb-12 font-medium">
            Inspirație, educație și produse într-un singur loc!
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/magazin">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Magazin Online
              </Button>
            </Link>
            
            <Link to="/cursuri">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <GraduationCap className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Cursuri Profesionale
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button variant="hero" size="hero" className="group min-w-[250px]">
                <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Contacte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              De ce să alegi Adress Beauty?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Suntem mai mult decât un brand – suntem o misiune de a oferi cele mai bune produse și servicii beauty din Moldova.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Magazine Online */}
            <div className="card-beauty text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Magazin Profesional
              </h3>
              <p className="text-muted-foreground mb-6">
                Peste 1000 de produse premium pentru extensii de gene, sprâncene și cosmetice profesionale.
              </p>
              <Link to="/magazin">
                <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  Explorează Produsele
                </Button>
              </Link>
            </div>

            {/* Cursuri */}
            <div className="card-beauty text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Educație de Calitate
              </h3>
              <p className="text-muted-foreground mb-6">
                6 programe de cursuri, de la începători la nivel profesional. Diplomă recunoscută și suport continuu.
              </p>
              <Link to="/cursuri">
                <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  Vezi Cursurile
                </Button>
              </Link>
            </div>

            {/* Servicii */}
            <div className="card-beauty text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Servicii Salon
              </h3>
              <p className="text-muted-foreground mb-6">
                Servicii profesionale în salonul nostru fizic cu cele mai noi tehnici și produse premium.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  Programează-te
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
            Începe transformarea ta profesională astăzi
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Alătură-te comunității noastre de profesioniști beauty și descoperă tot ce ai nevoie pentru succesul tău.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cursuri">
              <Button variant="hero" size="hero">
                Rezervă un Curs
              </Button>
            </Link>
            <Link to="/magazin">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground">
                Explorează Produsele
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;