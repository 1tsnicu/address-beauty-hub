import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram,
  Facebook,
  Send,
  MessageSquare,
  Calendar,
  ShoppingBag,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      titleRu: 'Телефон',
      details: ['+373 68 88 24 90', '+373 60 80 02 44'],
      action: 'tel:+37368882490'
    },
    {
      icon: Mail,
      title: 'Email',
      titleRu: 'Электронная почта',
      details: ['addressbeauty@mail.ru'],
      action: 'mailto:addressbeauty@mail.ru'
    },
    {
      icon: MapPin,
      title: 'Adresa',
      titleRu: 'Адрес',
      details: ['Chișinău, Moldova', 'Str. Exemplu 123'],
      action: null
    },
    {
      icon: Clock,
      title: 'Program',
      titleRu: 'Расписание',
      details: ['Lun-Vin: 9:00-18:00', 'Sâm: 10:00-16:00', 'Dum: Închis'],
      action: null
    }
  ];

  const inquiryTypes = [
    { value: 'courses', label: 'Întrebări despre cursuri', labelRu: 'Вопросы о курсах' },
    { value: 'products', label: 'Întrebări despre produse', labelRu: 'Вопросы о продуктах' },
    { value: 'appointment', label: 'Programare în salon', labelRu: 'Запись в салон' },
    { value: 'partnership', label: 'Colaborare/Parteneriat', labelRu: 'Сотрудничество/Партнерство' },
    { value: 'other', label: 'Altele', labelRu: 'Другое' }
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
    {
      name: 'Facebook',
      url: '#',
      icon: Facebook,
      handle: 'Adress Beauty'
    }
  ];

  const quickActions = [
    {
      title: 'Programează o Consultație',
      titleRu: 'Записаться на Консультацию',
      description: 'Consultație gratuită pentru cursuri',
      descriptionRu: 'Бесплатная консультация по курсам',
      icon: Calendar,
      link: '/cursuri'
    },
    {
      title: 'Comandă Produse',
      titleRu: 'Заказать Продукты',
      description: 'Peste 1000 produse premium',
      descriptionRu: 'Более 1000 премиум продуктов',
      icon: ShoppingBag,
      link: '/magazin'
    },
    {
      title: 'Informații Cursuri',
      titleRu: 'Информация о Курсах',
      description: '6 programe specializate',
      descriptionRu: '6 специализированных программ',
      icon: GraduationCap,
      link: '/cursuri'
    }
  ];


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Funcție statică pentru submit, doar vizual, fără trimitere către server/bază de date
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Mesajul a fost trimis! (simulat, fără trimitere reală)');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: ''
      });
    }, 1200);
  };


  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Contactează-ne
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suntem aici pentru tine! Contactează-ne pentru orice întrebare despre cursuri, 
            produse sau servicii. Echipa noastră îți va răspunde în cel mai scurt timp.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === 'RO' ? action.title : action.titleRu}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'RO' ? action.description : action.descriptionRu}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">
                    Informații de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {language === 'RO' ? info.title : info.titleRu}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {info.action ? (
                              <a 
                                href={info.action} 
                                className="hover:text-primary transition-colors"
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">
                    Urmărește-ne
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <social.icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{social.name}</div>
                        <div className="text-sm text-muted-foreground">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">
                    Locația Noastră
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Hartă interactivă</p>
                      <p className="text-xs">Google Maps va fi integrată</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Vezi pe Google Maps
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl sm:text-2xl text-primary flex items-center gap-2 sm:gap-3">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                    Trimite-ne un Mesaj
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nume complet *</Label>
                        <Input
                          id="name"
                          placeholder="Numele și prenumele"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="adresa@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+373 XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">Tipul întrebării</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {language === 'RO' ? type.label : type.labelRu}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subiect *</Label>
                      <Input
                        id="subject"
                        placeholder="Subiectul mesajului"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        placeholder="Descrie-ne întrebarea sau solicitarea ta..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Se trimite...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Trimite Mesajul
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Policies */}
      <section className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">
              Politici și Informații Legale
            </h2>
            <p className="text-muted-foreground">
              Pentru transparență și protecția datelor tale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Termeni și Condiții</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Termenii și condițiile generale de utilizare a serviciilor Adress Beauty.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Citește Termenii
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Politica de Retur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Condițiile de retur pentru produsele cosmetice și de îngrijire personală.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Vezi Politica
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Confidențialitate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Cum colectăm, folosim și protejăm informațiile tale personale.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Politica GDPR
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;