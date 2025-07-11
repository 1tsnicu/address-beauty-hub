import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  Check, 
  X, 
  Star,
  Calendar,
  Euro,
  Phone,
  Mail
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  nameRu: string;
  shortDescription: string;
  shortDescriptionRu: string;
  duration: string;
  durationRu: string;
  price: number;
  currency: string;
  priceAlt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  available: boolean;
  features: string[];
  featuresRu: string[];
  detailedDescription: string;
  detailedDescriptionRu: string;
  whatYouLearn: string[];
  whatYouLearnRu: string[];
  effects: string[];
  effectsRu: string[];
  whatYouGet: string[];
  whatYouGetRu: string[];
  practiceModels: number;
  supportDays: number;
  includesBranding: boolean;
  includesCareerStrategy: boolean;
  includesPortfolio: boolean;
  diploma: 'participation' | 'completion' | 'professional';
}

const courses: Course[] = [
  {
    id: 'startup',
    name: 'Start-Up',
    nameRu: 'Start-Up',
    shortDescription: 'Inițiere în extensii de gene (3 zile)',
    shortDescriptionRu: 'Введение в наращивание ресниц (3 дня)',
    duration: '3 zile',
    durationRu: '3 дня',
    price: 330,
    currency: 'EUR',
    priceAlt: '6600 MDL',
    level: 'beginner',
    available: true,
    features: ['Teorie de bază', 'Aplicare pe manechin', '3 modele reale'],
    featuresRu: ['Базовая теория', 'Применение на манекене', '3 реальные модели'],
    detailedDescription: 'Primii pași în carieră. Practică reală. Zero riscuri. Vrei să încerci domeniul extensiilor de gene, dar nu știi dacă este pentru tine? „Start UP" este un curs de inițiere creat special pentru începătoarele absolute care vor să testeze acest domeniu într-un cadru profesionist, fără investiții riscante.',
    detailedDescriptionRu: 'Первые шаги в карьере. Настоящая практика. Нулевые риски. Хочешь попробовать сферу наращивания ресниц, но не знаешь, подходит ли она тебе? "Start UP" - это вводный курс, созданный специально для новичков, которые хотят протестировать эту сферу в профессиональной среде, без рискованных инвестиций.',
    whatYouLearn: [
      'Teorie: Igienă, produse și noțiuni de bază',
      'Aplicare pe manechin + 3 modele reale',
      'Greșeli frecvente și cum le eviți',
      'Suport în crearea kitului pentru începători'
    ],
    whatYouLearnRu: [
      'Теория: Гигиена, продукты и основные понятия',
      'Применение на манекене + 3 реальные модели',
      'Частые ошибки и как их избежать',
      'Поддержка в создании стартового набора'
    ],
    effects: ['1D', '2D', 'Efect umed'],
    effectsRu: ['1D', '2D', 'Мокрый эффект'],
    whatYouGet: [
      'Diplomă de participare',
      'Fișă personalizată de progres',
      'Recomandări individuale pentru dezvoltare',
      'Bonus: reducere dacă alegi un curs mai avansat'
    ],
    whatYouGetRu: [
      'Диплом участия',
      'Персонализированная карта прогресса',
      'Индивидуальные рекомендации для развития',
      'Бонус: скидка при выборе более продвинутого курса'
    ],
    practiceModels: 3,
    supportDays: 30,
    includesBranding: false,
    includesCareerStrategy: false,
    includesPortfolio: false,
    diploma: 'participation'
  },
  {
    id: 'nextup',
    name: 'Next-Up',
    nameRu: 'Next-Up',
    shortDescription: 'Tehnica extensiilor de gene de la zero (5 zile)',
    shortDescriptionRu: 'Техника наращивания ресниц с нуля (5 дней)',
    duration: '5 zile',
    durationRu: '5 дней',
    price: 550,
    currency: 'EUR',
    priceAlt: '11000 MDL',
    level: 'beginner',
    available: true,
    features: ['Teorie completă', '7 modele reale', 'Suport 60 zile'],
    featuresRu: ['Полная теория', '7 реальных моделей', 'Поддержка 60 дней'],
    detailedDescription: 'Curs 100% practic, orientat spre rezultate comerciale rapide. Acest curs este dedicat începătoarelor care vor să învețe să aplice extensii de gene corect, eficient și cu scop profesional. Tot ce înveți, vei pune în aplicare. Te învățam pas cu pas, iar rezultatul final este o lucrare comercială reală.',
    detailedDescriptionRu: '100% практический курс, ориентированный на быстрые коммерческие результаты. Этот курс предназначен для новичков, которые хотят научиться правильно, эффективно и профессионально наращивать ресницы. Все, что изучаешь, применяешь на практике. Мы обучаем пошагово, а конечный результат - настоящая коммерческая работа.',
    whatYouLearn: [
      'Igienă, produse, tipuri de aplicare',
      'Izolare perfectă și poziționare corectă',
      'Aplicare pe manechin + 7 modele reale',
      'Identificarea și corectarea greșelilor',
      'Pregătirea pentru lucrul cu clienți reali'
    ],
    whatYouLearnRu: [
      'Гигиена, продукты, типы применения',
      'Идеальная изоляция и правильное позиционирование',
      'Применение на манекене + 7 реальных моделей',
      'Выявление и исправление ошибок',
      'Подготовка к работе с реальными клиентами'
    ],
    effects: ['1D', '2D', '3D', '4-6D', 'Volum', 'Efect de raze', 'Efect umed', 'Perfect line', '2 tehnici de formare a evantailor', '2 tehnici de aplicare a evantailor'],
    effectsRu: ['1D', '2D', '3D', '4-6D', 'Объем', 'Лучевой эффект', 'Мокрый эффект', 'Идеальная линия', '2 техники формирования веера', '2 техники применения веера'],
    whatYouGet: [
      'Diplomă de absolvire',
      'Fișă de progres personalizată',
      'Suport timp de 60 zile',
      'Recomandări pentru dezvoltare și achiziționare materiale'
    ],
    whatYouGetRu: [
      'Диплом об окончании',
      'Персонализированная карта прогресса',
      'Поддержка в течение 60 дней',
      'Рекомендации по развитию и приобретению материалов'
    ],
    practiceModels: 7,
    supportDays: 60,
    includesBranding: false,
    includesCareerStrategy: false,
    includesPortfolio: false,
    diploma: 'completion'
  },
  {
    id: 'academia',
    name: 'Academia Lash Pro',
    nameRu: 'Academia Lash Pro',
    shortDescription: 'Program intensiv de 15 zile',
    shortDescriptionRu: 'Интенсивная программа 15 дней',
    duration: '15 zile',
    durationRu: '15 дней',
    price: 1500,
    currency: 'EUR',
    priceAlt: '30000 MDL',
    level: 'advanced',
    available: true,
    features: ['12+ modele reale', 'Branding personal', 'Mentorat 3 luni'],
    featuresRu: ['12+ реальных моделей', 'Личный брендинг', 'Менторство 3 месяца'],
    detailedDescription: 'Academia completă pentru viitoarele meștere de elită. Acesta este cel mai avansat program de formare din cadrul Adress Beauty — dedicat celor care își doresc o carieră în domeniul lash, nu doar un hobby. Cursul acoperă toate etapele profesionale: tehnică, practică, imagine, branding și strategii de dezvoltare.',
    detailedDescriptionRu: 'Полная академия для будущих мастеров элитного уровня. Это самая продвинутая программа обучения в Adress Beauty — для тех, кто хочет построить карьеру в сфере lash, а не просто хобби. Курс охватывает все профессиональные этапы: технику, практику, имидж, брендинг и стратегии развития.',
    whatYouLearn: [
      'Teorie completă + aplicare practică pe peste 12 modele reale',
      'Izolare, simetrie, mixări, texturi comerciale',
      'Branding personal: conținut foto, Reels, Instagram',
      'Strategii de atragere a clienților și poziționare pe piață',
      'Corecturi zilnice, feedback individual și mentorat',
      'Teme pentru acasă în zilele la distanță'
    ],
    whatYouLearnRu: [
      'Полная теория + практическое применение на 12+ реальных моделях',
      'Изоляция, симметрия, миксы, коммерческие текстуры',
      'Личный брендинг: фото контент, Reels, Instagram',
      'Стратегии привлечения клиентов и позиционирование на рынке',
      'Ежедневные коррекции, индивидуальная обратная связь и менторство',
      'Домашние задания в дистанционные дни'
    ],
    effects: ['1D', '2D', '3D', '4-6D', 'Volum', 'Efect de raze', 'Efect umed', 'Perfect line', 'Ombre', 'Anime', 'Lucrări comerciale etc...'],
    effectsRu: ['1D', '2D', '3D', '4-6D', 'Объем', 'Лучевой эффект', 'Мокрый эффект', 'Идеальная линия', 'Омбре', 'Аниме', 'Коммерческие работы и др.'],
    whatYouGet: [
      'Diplomă profesională recunoscută',
      'Portofoliu de lucrări (posibil photoshoot profesional)',
      'Mentorat intensiv timp de 3 luni după finalizarea cursului',
      'Încredere, structură, rezultate reale'
    ],
    whatYouGetRu: [
      'Признанный профессиональный диплом',
      'Портфолио работ (возможна профессиональная фотосессия)',
      'Интенсивное менторство в течение 3 месяцев после завершения курса',
      'Уверенность, структура, реальные результаты'
    ],
    practiceModels: 12,
    supportDays: 90,
    includesBranding: true,
    includesCareerStrategy: true,
    includesPortfolio: true,
    diploma: 'professional'
  },
  {
    id: 'lamination',
    name: 'Laminare Gene',
    nameRu: 'Ламинирование Ресниц',
    shortDescription: 'Specializare laminare (2 zile)',
    shortDescriptionRu: 'Специализация ламинирование (2 дня)',
    duration: '2 zile',
    durationRu: '2 дня',
    price: 200,
    currency: 'EUR',
    priceAlt: '4000 MDL',
    level: 'intermediate',
    available: true,
    features: ['Tehnică laminare', '5 modele reale', 'Certificat specializare'],
    featuresRu: ['Техника ламинирования', '5 реальных моделей', 'Сертификат специализации'],
    detailedDescription: 'Curs specializat în tehnica laminării genelor - procedura care oferă gene naturale, curbate și voluminoase fără extensii. Ideal pentru meșterii care vor să-și extindă gama de servicii cu o tehnică foarte căutată și profitabilă.',
    detailedDescriptionRu: 'Специализированный курс по технике ламинирования ресниц - процедуре, которая делает натуральные ресницы изогнутыми и объемными без наращивания. Идеально для мастеров, которые хотят расширить спектр услуг востребованной и прибыльной техникой.',
    whatYouLearn: [
      'Teoria și practica laminării genelor',
      'Selectarea produselor și instrumentelor',
      'Tehnici de aplicare și timing',
      'Sfaturi pentru întreținere și rezultate durabile'
    ],
    whatYouLearnRu: [
      'Теория и практика ламинирования ресниц',
      'Выбор продуктов и инструментов',
      'Техники применения и тайминг',
      'Советы по уходу и долговременным результатам'
    ],
    effects: ['Laminare clasică', 'Botox pentru gene', 'Lifting gene'],
    effectsRu: ['Классическое ламинирование', 'Ботокс для ресниц', 'Лифтинг ресниц'],
    whatYouGet: [
      'Certificat de specializare',
      'Manual de proceduri',
      'Recomandări pentru produse',
      'Suport post-curs'
    ],
    whatYouGetRu: [
      'Сертификат специализации',
      'Руководство по процедурам',
      'Рекомендации по продуктам',
      'Послекурсовая поддержка'
    ],
    practiceModels: 5,
    supportDays: 30,
    includesBranding: false,
    includesCareerStrategy: false,
    includesPortfolio: false,
    diploma: 'completion'
  },
  {
    id: 'perfection',
    name: 'Curs de Perfecționare',
    nameRu: 'Курс Совершенствования',
    shortDescription: 'Tehnici avansate (2 zile)',
    shortDescriptionRu: 'Продвинутые техники (2 дня)',
    duration: '2 zile',
    durationRu: '2 дня',
    price: 250,
    currency: 'EUR',
    priceAlt: '5000 MDL',
    level: 'advanced',
    available: true,
    features: ['Tehnici avansate', 'Corectarea erorilor', 'Optimizare workflow'],
    featuresRu: ['Продвинутые техники', 'Исправление ошибок', 'Оптимизация рабочего процесса'],
    detailedDescription: 'Curs avansat destinat meșterilor cu experiență care vor să-și perfecționeze tehnicile, să învețe noi metode și să-și optimizeze procesul de lucru. Focalizat pe calitate, eficiență și rezultate comerciale superioare.',
    detailedDescriptionRu: 'Продвинутый курс для опытных мастеров, которые хотят усовершенствовать свои техники, изучить новые методы и оптимизировать рабочий процесс. Фокус на качестве, эффективности и превосходных коммерческих результатах.',
    whatYouLearn: [
      'Tehnici avansate de volum și texturi',
      'Optimizarea timpului de lucru',
      'Corectarea și refacerea lucrărilor',
      'Noi tendințe și stiluri'
    ],
    whatYouLearnRu: [
      'Продвинутые техники объема и текстур',
      'Оптимизация рабочего времени',
      'Коррекция и переделка работ',
      'Новые тенденции и стили'
    ],
    effects: ['Mega volum', 'Texturi mixte', 'Efecte artistice', 'Stiluri trendy'],
    effectsRu: ['Мега объем', 'Смешанные текстуры', 'Художественные эффекты', 'Трендовые стили'],
    whatYouGet: [
      'Certificat de perfecționare',
      'Acces la grup privat de mașteri',
      'Materiale de lucru premium',
      'Consultanță business'
    ],
    whatYouGetRu: [
      'Сертификат усовершенствования',
      'Доступ к приватной группе мастеров',
      'Премиум рабочие материалы',
      'Бизнес-консультации'
    ],
    practiceModels: 4,
    supportDays: 45,
    includesBranding: false,
    includesCareerStrategy: true,
    includesPortfolio: false,
    diploma: 'professional'
  },
  {
    id: 'coming-soon',
    name: 'Curs în Pregătire',
    nameRu: 'Готовящийся Курс',
    shortDescription: 'Anunț în curând',
    shortDescriptionRu: 'Анонс скоро',
    duration: 'TBD',
    durationRu: 'TBD',
    price: 0,
    currency: 'EUR',
    priceAlt: 'TBD',
    level: 'beginner',
    available: false,
    features: ['În dezvoltare'],
    featuresRu: ['В разработке'],
    detailedDescription: 'Un nou curs inovator este în pregătire. Urmărește-ne pentru a fi primul care află detaliile!',
    detailedDescriptionRu: 'Новый инновационный курс готовится. Следи за нами, чтобы первым узнать подробности!',
    whatYouLearn: ['Detalii vor fi anunțate în curând'],
    whatYouLearnRu: ['Детали будут объявлены в ближайшее время'],
    effects: ['TBD'],
    effectsRu: ['TBD'],
    whatYouGet: ['TBD'],
    whatYouGetRu: ['TBD'],
    practiceModels: 0,
    supportDays: 0,
    includesBranding: false,
    includesCareerStrategy: false,
    includesPortfolio: false,
    diploma: 'participation'
  }
];

const CoursesPage = () => {
  const { t, language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getCourseTitle = (course: Course) => language === 'RO' ? course.name : course.nameRu;
  const getCourseDescription = (course: Course) => language === 'RO' ? course.shortDescription : course.shortDescriptionRu;

  const comparisonFeatures = [
    { key: 'duration', label: 'Ore de studiu', labelRu: 'Часы обучения' },
    { key: 'models', label: 'Practică pe modele', labelRu: 'Практика на моделях' },
    { key: 'support', label: 'Suport post-curs', labelRu: 'Послекурсовая поддержка' },
    { key: 'branding', label: 'Branding & Content', labelRu: 'Брендинг и Контент' },
    { key: 'career', label: 'Strategie carieră completă', labelRu: 'Полная карьерная стратегия' },
    { key: 'portfolio', label: 'Portofoliu profesional', labelRu: 'Профессиональное портфолио' },
    { key: 'diploma', label: 'Diplomă de carieră', labelRu: 'Карьерный диплом' }
  ];

  const getFeatureValue = (course: Course, feature: string) => {
    switch (feature) {
      case 'duration':
        return course.duration === '3 zile' ? '30h' : 
               course.duration === '5 zile' ? '50h' : 
               course.duration === '15 zile' ? '90h' : 
               course.duration === '2 zile' ? '16h' : 'TBD';
      case 'models':
        return course.practiceModels > 0 ? `${course.practiceModels} modele` : 'TBD';
      case 'support':
        return course.supportDays > 0 ? `${course.supportDays} zile` : 'TBD';
      case 'branding':
        return course.includesBranding;
      case 'career':
        return course.includesCareerStrategy;
      case 'portfolio':
        return course.includesPortfolio;
      case 'diploma':
        return course.diploma === 'professional';
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
          Cursuri Beauty
        </h1>
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xl text-muted-foreground">
            La Adress Beauty credem în puterea educației de calitate.
          </p>
          <p className="text-lg text-muted-foreground">
            Cursurile noastre sunt concepute pentru a oferi nu doar informații, ci și o transformare profesională reală.
          </p>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              !course.available ? 'opacity-60' : 'hover:scale-105'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={course.level === 'beginner' ? 'secondary' : course.level === 'intermediate' ? 'default' : 'destructive'}>
                  {course.level === 'beginner' ? 'Începător' : course.level === 'intermediate' ? 'Intermediar' : 'Avansat'}
                </Badge>
                {!course.available && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    În pregătire
                  </Badge>
                )}
              </div>
              <CardTitle className="font-heading text-xl text-primary">
                {getCourseTitle(course)}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {getCourseDescription(course)}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{language === 'RO' ? course.duration : course.durationRu}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.practiceModels} modele</span>
                </div>
              </div>

              <div className="space-y-2">
                {course.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{language === 'RO' ? feature : course.featuresRu[index]}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {course.price > 0 ? `${course.price} ${course.currency}` : 'TBD'}
                    </div>
                    {course.priceAlt !== 'TBD' && (
                      <div className="text-sm text-muted-foreground">
                        {course.priceAlt}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedCourse(course)}
                        disabled={!course.available}
                      >
                        {course.available ? 'Vezi Detalii' : 'În curând'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-heading text-2xl text-primary">
                          {getCourseTitle(course)}
                        </DialogTitle>
                        <DialogDescription>
                          {getCourseDescription(course)}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedCourse && (
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Descriere</h3>
                                <p className="text-muted-foreground">
                                  {language === 'RO' ? selectedCourse.detailedDescription : selectedCourse.detailedDescriptionRu}
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Ce înveți</h3>
                                <ul className="space-y-1">
                                  {(language === 'RO' ? selectedCourse.whatYouLearn : selectedCourse.whatYouLearnRu).map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Efecte și Volume</h3>
                                <div className="flex flex-wrap gap-2">
                                  {(language === 'RO' ? selectedCourse.effects : selectedCourse.effectsRu).map((effect, index) => (
                                    <Badge key={index} variant="outline">{effect}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Ce primești</h3>
                                <ul className="space-y-1">
                                  {(language === 'RO' ? selectedCourse.whatYouGet : selectedCourse.whatYouGetRu).map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                            <Button className="flex-1" size="lg">
                              <Phone className="h-4 w-4 mr-2" />
                              Rezervă Locul: +373 68 88 24 90
                            </Button>
                            <Button variant="outline" size="lg">
                              <Mail className="h-4 w-4 mr-2" />
                              Email: addressbeauty@mail.ru
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {course.available && (
                    <Button variant="outline" className="w-full" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programează o Vizită
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-primary text-center">
            Comparație Cursuri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Element</TableHead>
                  <TableHead className="text-center">Start-Up</TableHead>
                  <TableHead className="text-center">Next-Up</TableHead>
                  <TableHead className="text-center">Academia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((feature) => (
                  <TableRow key={feature.key}>
                    <TableCell className="font-medium">
                      {language === 'RO' ? feature.label : feature.labelRu}
                    </TableCell>
                    {courses.slice(0, 3).map((course) => {
                      const value = getFeatureValue(course, feature.key);
                      return (
                        <TableCell key={course.id} className="text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{value}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10 border-0">
        <CardContent className="text-center py-12">
          <h2 className="font-heading text-3xl font-bold text-primary mb-4">
            Gata să-ți începi transformarea profesională?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Alege cursul potrivit pentru tine și fă primul pas către o carieră de succes în beauty!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[200px]">
              <Phone className="h-5 w-5 mr-2" />
              Sună acum: +373 68 88 24 90
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              <Mail className="h-5 w-5 mr-2" />
              Scrie-ne: addressbeauty@mail.ru
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;