import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const BackToTopButton: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  
  // Afișăm butonul doar când utilizatorul a făcut scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (!isVisible) return null;
  
  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-1"
      onClick={scrollToTop}
      aria-label={t('back.to.top')}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
};

export default BackToTopButton;
