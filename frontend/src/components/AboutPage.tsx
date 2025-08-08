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
      name: 'Elena Popescu',
      role: 'Fondator & Master Trainer',
      roleRu: 'Основатель и Мастер-Тренер',
      experience: '8+ ani experiență',
      experienceRu: '8+ лет опыта',
      specialization: 'Extensii gene, Laminare',
      specializationRu: 'Наращивание ресниц, Ламинирование',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Maria Ionescu',
      role: 'Senior Master',
      roleRu: 'Старший Мастер',
      experience: '6+ ani experiență',
      experienceRu: '6+ лет опыта',
      specialization: 'Volum Rus, Mega Volum',
      specializationRu: 'Русский объем, Мега объем',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Ana Dumitrescu',
      role: 'Master Specialist',
      roleRu: 'Мастер-Специалист',
      experience: '4+ ani experiență',
      experienceRu: '4+ года опыта',
      specialization: 'Sprâncene, Laminare Gene',
      specializationRu: 'Брови, Ламинирование ресниц',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop&crop=face'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Clienți mulțumiți', labelRu: 'Довольных клиентов' },
    { number: '200+', label: 'Cursanți absolvenți', labelRu: 'Выпускников курсов' },
    { number: '1000+', label: 'Produse premium', labelRu: 'Премиум продуктов' },
    { number: '5+', label: 'Ani de experiență', labelRu: 'Лет опыта' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Despre Adress Beauty
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-foreground font-medium">
              Adress Beauty este mai mult decât un brand – este o misiune.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ne-am propus să oferim cele mai bune produse, cele mai bine structurate cursuri 
              și cele mai apreciate servicii beauty din Moldova. Suntem dedicați să transformăm 
              pasiunea pentru frumusețe într-o carieră de succes pentru fiecare client.
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
                  Misiunea Noastră
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Să oferim educație de înaltă calitate, produse premium și servicii excepționale 
                  în domeniul beauty, creând o comunitate de profesioniști pasionați care 
                  transformă vietile oamenilor prin frumusețe și încredere în sine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary flex items-center gap-3">
                  <Star className="h-6 w-6" />
                  Viziunea Noastră
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Să devenim cea mai respectată și iubită academie beauty din Moldova, 
                  recunoscută pentru standardele înalte de calitate, inovație și 
                  dedicarea către succesul fiecărui student și client.
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
              Valorile Noastre
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Principiile care ne ghidează în fiecare zi și în fiecare interacțiune cu clienții noștri
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
              Echipa Noastră
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profesioniști dedicați cu experiență vastă și pasiune pentru perfecțiune
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <p>{language === 'RO' ? member.experience : member.experienceRu}</p>
                    <p className="font-medium">
                      {language === 'RO' ? member.specialization : member.specializationRu}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Gallery */}
      <section className="py-16 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Salonul Nostru
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un spațiu modern, curat și relaxant, conceput pentru confortul și satisfacția clienților
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop'
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
            Alătură-te Comunității Adress Beauty
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fie că vrei să înveți, să cumperi produse premium sau să beneficiezi de serviciile noastre, 
            suntem aici pentru tine!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cursuri">
              <Button size="lg" className="min-w-[200px]">
                Vezi Cursurile
              </Button>
            </Link>
            <Link to="/magazin">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Explorează Magazinul
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Phone className="h-5 w-5 mr-2" />
                Contactează-ne
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