import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram,
  Facebook,
  Clock,
  Heart,
  Send
} from 'lucide-react';

const Footer = () => {
  const { t, language } = useLanguage();

  const footerLinks = {
    services: [
      { name: 'Cursuri Beauty', nameRu: 'Beauty Курсы', path: '/cursuri' },
      { name: 'Magazin Online', nameRu: 'Интернет Магазин', path: '/magazin' },
      { name: 'Servicii Salon', nameRu: 'Услуги Салона', path: '/despre' },
      { name: 'Programări', nameRu: 'Записи', path: '/contact' }
    ],
    courses: [
      { name: 'Start-Up (3 zile)', nameRu: 'Start-Up (3 дня)', path: '/cursuri#startup' },
      { name: 'Next-Up (5 zile)', nameRu: 'Next-Up (5 дней)', path: '/cursuri#nextup' },
      { name: 'Academia Lash Pro', nameRu: 'Academia Lash Pro', path: '/cursuri#academia' },
      { name: 'Laminare Gene', nameRu: 'Ламинирование', path: '/cursuri#lamination' }
    ],
    company: [
      { name: 'Despre Noi', nameRu: 'О Нас', path: '/despre' },
      { name: 'Echipa', nameRu: 'Команда', path: '/despre#echipa' },
      { name: 'Contact', nameRu: 'Контакт', path: '/contact' },
      { name: 'Livrare', nameRu: 'Доставка', path: '/livrare' }
    ],
    legal: [
      { name: 'Termeni și Condiții', nameRu: 'Условия использования', path: '/termeni' },
      { name: 'Politica de Retur', nameRu: 'Политика возврата', path: '/retur' },
      { name: 'Confidențialitate', nameRu: 'Конфиденциальность', path: '/confidentialitate' },
      { name: 'Cookies', nameRu: 'Куки', path: '/cookies' }
    ]
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefon',
      labelRu: 'Телефон',
      values: ['+373 68 88 24 90', '+373 60 80 02 44'],
      link: 'tel:+37368882490'
    },
    {
      icon: Mail,
      label: 'Email',
      labelRu: 'Email',
      values: ['addressbeauty@mail.ru'],
      link: 'mailto:addressbeauty@mail.ru'
    },
    {
      icon: MapPin,
      label: 'Adresa',
      labelRu: 'Адрес',
      values: ['Chișinău, Moldova'],
      link: null
    },
    {
      icon: Clock,
      label: 'Program',
      labelRu: 'Расписание',
      values: ['Lun-Vin: 9:00-18:00', 'Sâm: 10:00-16:00'],
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/beperfect.md',
      icon: Instagram,
      handle: '@beperfect.md'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@beperfect.mdd',
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      handle: '@beperfect.mdd'
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t">

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Contact - Full width on mobile, takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="max-w-md">
              {/* Brand */}
              <div className="mb-8">
                <Link to="/" className="inline-block">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-3">
                    Address Beauty
                  </h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'RO' 
                    ? 'Transformăm pasiunea pentru frumusețe în carieră de succes prin cursuri profesionale și servicii de calitate.'
                    : 'Превращаем страсть к красоте в успешную карьеру через профессиональные курсы и качественные услуги.'
                  }
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2">
                  {language === 'RO' ? 'Informații Contact' : 'Контактная информация'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                        <info.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {language === 'RO' ? info.label : info.labelRu}
                        </div>
                        {info.values.map((value, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground mt-1">
                            {info.link ? (
                              <a href={info.link} className="hover:text-primary transition-colors">
                                {value}
                              </a>
                            ) : (
                              value
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2 mb-4">
                  {language === 'RO' ? 'Urmărește-ne' : 'Следуй за нами'}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-primary/10 transition-all duration-300"
                      title={social.handle}
                    >
                      <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        {social.handle}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Services & Courses */}
              <div className="space-y-8">
                {/* Services */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2 mb-4">
                    {language === 'RO' ? 'Servicii' : 'Услуги'}
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                          {language === 'RO' ? link.name : link.nameRu}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Courses */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2 mb-4">
                    {language === 'RO' ? 'Cursuri' : 'Курсы'}
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.courses.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                          {language === 'RO' ? link.name : link.nameRu}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Company & Legal */}
              <div className="space-y-8">
                {/* Company */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2 mb-4">
                    {language === 'RO' ? 'Companie' : 'Компания'}
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                          {language === 'RO' ? link.name : link.nameRu}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground border-b border-primary/20 pb-2 mb-4">
                    {language === 'RO' ? 'Legal' : 'Юридическая информация'}
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <Link 
                          to={link.path} 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                          {language === 'RO' ? link.name : link.nameRu}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-secondary/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Adress Beauty. {language === 'RO' ? 'Toate drepturile rezervate.' : 'Все права защищены.'}
              </div>
              <div className="hidden md:block w-px h-4 bg-border"></div>
              <div className="text-xs text-muted-foreground">
              Creat de{' '}
                <a
                  href="https://megapromoting.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Mega Promoting
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground">
                {language === 'RO' ? 'Urmărește-ne:' : 'Следуй за нами:'}
              </div>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title={social.handle}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
