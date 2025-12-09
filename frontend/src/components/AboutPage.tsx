import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  Star, 
  Instagram,
  Facebook,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import salonImage1 from '@/assets/photo_2025-12-09 10.58.01.jpeg';
import salonImage2 from '@/assets/photo_2025-12-09 10.58.05.jpeg';
import salonImage3 from '@/assets/photo_2025-12-09 10.58.09.jpeg';
import salonImage4 from '@/assets/photo_2025-12-09 10.58.12.jpeg';

const AboutPage = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: 'Pasiune pentru Frumusețe',
      titleRu: 'Страсть к Красоте',
      description: 'Credem că frumusețea este o artă și fiecare client merită să se simtă special și încrezător.',
      descriptionRu: 'Мы верим, что красота - это искусство, и каждый клиент заслуживает чувствовать себя особенным и уверенным.'
    },
    {
      icon: Target,
      title: 'Excelență în Servicii',
      titleRu: 'Превосходство в Услугах',
      description: 'Nu acceptăm compromisuri când vine vorba de calitatea serviciilor și produselor noastre.',
      descriptionRu: 'Мы не идем на компромиссы, когда речь идет о качестве наших услуг и продуктов.'
    },
    {
      icon: Users,
      title: 'Educație Continuă',
      titleRu: 'Непрерывное Образование',
      description: 'Investim constant în educația echipei noastre pentru a rămâne la vârful inovațiilor din beauty.',
      descriptionRu: 'Мы постоянно инвестируем в образование нашей команды, чтобы оставаться на переднем крае beauty инноваций.'
    },
    {
      icon: Award,
      title: 'Profesionalism Absolut',
      titleRu: 'Абсолютный Профессионализм',
      description: 'Fiecare membru al echipei noastre este un profesionist dedicat și pasionat de domeniu.',
      descriptionRu: 'Каждый член нашей команды - преданный своему делу профессионал, увлеченный своей сферой.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dumitrița Gabuja',
      role: 'Master & Lash Trainer',
      roleRu: 'Мастер и Тренер по Ресницам',
      experience: '10 ani experiență în domeniul lash & lami-beauty',
      experienceRu: '10 лет опыта в области lash & lami-beauty',
      specialization: 'Fondatoarea brandului Adress Beauty, cu 7 ani experiență în predarea cursurilor',
      specializationRu: 'Основатель бренда Adress Beauty, с 7-летним опытом преподавания',
      education: 'Studii superioare în Psihopedagogie, Managementul serviciilor de frumusețe, Business și Administrare',
      educationRu: 'Высшее образование в области Психопедагогики, Управления услугами красоты, Бизнеса и Администрирования',
      age: '31 ani',
      ageRu: '31 год',
      philosophy: 'Îmbin pasiunea pentru frumusețe cu dorința de a împărtăși cunoștințe și de a sprijini alți profesioniști să se dezvolte.',
      philosophyRu: 'Объединяю страсть к красоте с желанием делиться знаниями и поддерживать других профессионалов в развитии.',
      image: '/src/assets/dumitrita-gabuja.jpg'
    }
  ];

  const achievements = [
    { number: '500+', label: t('about.achievements.clients'), labelRu: t('about.achievements.clients') },
    { number: '200+', label: t('about.achievements.students'), labelRu: t('about.achievements.students') },
    { number: '1000+', label: t('about.achievements.products'), labelRu: t('about.achievements.products') },
    { number: '5+', label: t('about.achievements.experience'), labelRu: t('about.achievements.experience') }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('about.title')}
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-foreground font-medium">
              {t('about.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
          </div>
          
          {/* Achievements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {achievement.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'RO' ? achievement.label : achievement.labelRu}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  {t('about.mission.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary flex items-center gap-3">
                  <Star className="h-6 w-6" />
                  {t('about.vision.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.vision.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-heading text-lg text-primary">
                    {language === 'RO' ? value.title : value.titleRu}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {language === 'RO' ? value.description : value.descriptionRu}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-sm w-full">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-3">
                    {language === 'RO' ? member.role : member.roleRu}
                  </Badge>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-primary">
                      {language === 'RO' ? member.experience : member.experienceRu}
                    </p>
                    <p>
                      {language === 'RO' ? member.specialization : member.specializationRu}
                    </p>
                    {member.education && (
                      <p className="text-xs">
                        <span className="font-medium">{t('about.education')}</span> {language === 'RO' ? member.education : member.educationRu}
                      </p>
                    )}
                    {member.age && (
                      <p className="text-xs">
                        <span className="font-medium">{t('about.age')}</span> {language === 'RO' ? member.age : member.ageRu}
                      </p>
                    )}
                    {member.philosophy && (
                      <p className="text-xs italic mt-3 pt-3 border-t border-gray-200">
                        "{language === 'RO' ? member.philosophy : member.philosophyRu}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Salon Gallery */}
      <section className="py-16 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('about.salon.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.salon.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              salonImage1,
              salonImage2,
              salonImage3,
              salonImage4
            ].map((image, index) => (
              <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={image}
                  alt={`Salon ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cursuri">
              <Button size="lg" className="min-w-[200px]">
                {t('about.cta.courses')}
              </Button>
            </Link>
            <Link to="/magazin">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                {t('about.cta.shop')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Phone className="h-5 w-5 mr-2" />
                {t('about.cta.contact')}
              </Button>
            </Link>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-4 mt-8">
            <a 
              href="https://www.instagram.com/beperfect.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@beperfect.md</span>
            </a>
            <a 
              href="https://www.tiktok.com/@beperfect.mdd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span>@beperfect.mdd</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;