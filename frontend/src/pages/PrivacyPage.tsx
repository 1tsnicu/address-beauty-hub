import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: 'Informații Generale',
      titleRu: 'Общая Информация',
      icon: Shield,
      content: [
        'Adress Beauty respectă confidențialitatea și protecția datelor personale.',
        'Această politică explică cum colectăm, folosim și protejăm informațiile tale.',
        'Politica este conformă cu GDPR și legislația din Moldova.',
        'Prin utilizarea serviciilor noastre, accepți această politică.'
      ],
      contentRu: [
        'Adress Beauty уважает конфиденциальность и защиту персональных данных.',
        'Эта политика объясняет, как мы собираем, используем и защищаем вашу информацию.',
        'Политика соответствует GDPR и законодательству Молдовы.',
        'Используя наши услуги, вы принимаете эту политику.'
      ]
    },
    {
      title: 'Date Colectate',
      titleRu: 'Собираемые Данные',
      icon: Database,
      content: [
        'Informații de contact: nume, email, telefon, adresă.',
        'Date de înregistrare la cursuri și preferințe educaționale.',
        'Istoricul achizițiilor și interacțiunile cu site-ul.',
        'Cookies și date de navigare pentru îmbunătățirea experienței.'
      ],
      contentRu: [
        'Контактная информация: имя, email, телефон, адрес.',
        'Данные регистрации на курсы и образовательные предпочтения.',
        'История покупок и взаимодействий с сайтом.',
        'Cookies и данные навигации для улучшения опыта.'
      ]
    },
    {
      title: 'Utilizarea Datelor',
      titleRu: 'Использование Данных',
      icon: Eye,
      content: [
        'Furnizarea serviciilor și cursurilor solicitate.',
        'Comunicarea despre cursuri, oferte și actualizări.',
        'Procesarea plăților și gestionarea conturilor.',
        'Îmbunătățirea serviciilor și personalizarea experienței.'
      ],
      contentRu: [
        'Предоставление запрашиваемых услуг и курсов.',
        'Коммуникация о курсах, предложениях и обновлениях.',
        'Обработка платежей и управление аккаунтами.',
        'Улучшение услуг и персонализация опыта.'
      ]
    },
    {
      title: 'Partajarea Datelor',
      titleRu: 'Передача Данных',
      icon: UserCheck,
      content: [
        'Nu vindem sau închiriem datele personale terților.',
        'Datele pot fi partajate cu partenerii de plată (securizat).',
        'Informațiile pot fi dezvăluite dacă sunt cerute legal.',
        'Cu acordul explicit, pentru newsletter și comunicări.'
      ],
      contentRu: [
        'Мы не продаем и не сдаем в аренду персональные данные третьим лицам.',
        'Данные могут быть переданы платежным партнерам (безопасно).',
        'Информация может быть раскрыта при законных требованиях.',
        'С явным согласием, для рассылки и коммуникаций.'
      ]
    },
    {
      title: 'Securitatea Datelor',
      titleRu: 'Безопасность Данных',
      icon: Lock,
      content: [
        'Folosim encriptare SSL pentru toate tranzacțiile.',
        'Accesul la date este restricționat doar pentru personalul autorizat.',
        'Backup-urile sunt făcute regulat și securizat.',
        'Monitorizăm constant pentru încercări de acces neautorizat.'
      ],
      contentRu: [
        'Мы используем SSL шифрование для всех транзакций.',
        'Доступ к данным ограничен только для авторизованного персонала.',
        'Резервные копии создаются регулярно и безопасно.',
        'Мы постоянно мониторим попытки несанкционированного доступа.'
      ]
    },
    {
      title: 'Drepturile Tale',
      titleRu: 'Ваши Права',
      icon: AlertTriangle,
      content: [
        'Dreptul de acces la datele personale stocate.',
        'Dreptul de rectificare a informațiilor incorecte.',
        'Dreptul de ștergere (dreptul de a fi uitat).',
        'Dreptul de opoziție la procesarea în anumite scopuri.'
      ],
      contentRu: [
        'Право доступа к хранимым персональным данным.',
        'Право исправления неточной информации.',
        'Право на удаление (право быть забытым).',
        'Право возражения против обработки в определенных целях.'
      ]
    }
  ];

  const cookieTypes = [
    {
      name: 'Cookies Esențiale',
      nameRu: 'Основные Cookies',
      description: 'Necesare pentru funcționarea de bază a site-ului.',
      descriptionRu: 'Необходимы для базового функционирования сайта.',
      required: true
    },
    {
      name: 'Cookies Analitice',
      nameRu: 'Аналитические Cookies',
      description: 'Ajută la înțelegerea modului de utilizare a site-ului.',
      descriptionRu: 'Помогают понять, как используется сайт.',
      required: false
    },
    {
      name: 'Cookies Marketing',
      nameRu: 'Маркетинговые Cookies',
      description: 'Folosite pentru personalizarea reclamelor și conținutului.',
      descriptionRu: 'Используются для персонализации рекламы и контента.',
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-light-blue/20 to-primary/10">
        <div className="container mx-auto px-4">
          <Link to="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {language === 'RO' ? 'Înapoi la Contact' : 'Назад к Контактам'}
          </Link>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            {language === 'RO' ? 'Politica de Confidențialitate' : 'Политика Конфиденциальности'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {language === 'RO' 
              ? 'Cum protejăm și folosim informațiile tale personale. Conformă GDPR și legislația din Moldova.'
              : 'Как мы защищаем и используем вашу личную информацию. Соответствует GDPR и законодательству Молдовы.'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    {language === 'RO' ? section.title : section.titleRu}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(language === 'RO' ? section.content : section.contentRu).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cookies Section */}
          <Card className="mt-12 border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Database className="h-5 w-5 text-accent" />
                </div>
                {language === 'RO' ? 'Politica Cookies' : 'Политика Cookies'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {language === 'RO' 
                  ? 'Folosim diferite tipuri de cookies pentru a îmbunătăți experiența ta pe site:'
                  : 'Мы используем различные типы cookies для улучшения вашего опыта на сайте:'
                }
              </p>
              <div className="space-y-4">
                {cookieTypes.map((cookie, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${cookie.required ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {language === 'RO' ? cookie.name : cookie.nameRu}
                        {cookie.required && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {language === 'RO' ? 'Obligatorii' : 'Обязательные'}
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'RO' ? cookie.description : cookie.descriptionRu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rights Exercise */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                {language === 'RO' ? 'Exercitarea Drepturilor' : 'Осуществление Прав'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'RO' 
                  ? 'Pentru a-ți exercita drepturile GDPR sau pentru întrebări despre confidențialitate:'
                  : 'Для осуществления ваших прав GDPR или вопросов о конфиденциальности:'
                }
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    {language === 'RO' ? 'Cereri GDPR:' : 'Запросы GDPR:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {language === 'RO' ? 'Acces la date personale' : 'Доступ к персональным данным'}</li>
                    <li>• {language === 'RO' ? 'Rectificarea datelor' : 'Исправление данных'}</li>
                    <li>• {language === 'RO' ? 'Ștergerea datelor' : 'Удаление данных'}</li>
                    <li>• {language === 'RO' ? 'Portabilitatea datelor' : 'Портируемость данных'}</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    {language === 'RO' ? 'Timp de răspuns:' : 'Время ответа:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {language === 'RO' ? 'Confirmarea cererii: 24h' : 'Подтверждение запроса: 24ч'}</li>
                    <li>• {language === 'RO' ? 'Răspuns complet: max 30 zile' : 'Полный ответ: макс 30 дней'}</li>
                    <li>• {language === 'RO' ? 'Cereri urgente: 72h' : 'Срочные запросы: 72ч'}</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:addressbeauty@mail.ru?subject=Cerere GDPR">
                    {language === 'RO' ? 'Trimite Cerere GDPR' : 'Отправить Запрос GDPR'}
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">
                    {language === 'RO' ? 'Contactează-ne' : 'Связаться с нами'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {language === 'RO' ? 'Ultima actualizare: 11 iulie 2025' : 'Последнее обновление: 11 июля 2025'} |{' '}
            {language === 'RO' ? 'Versiunea 2.1' : 'Версия 2.1'}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
