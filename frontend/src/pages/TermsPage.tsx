import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: 'Definiții și Termeni',
      titleRu: 'Определения и Термины',
      icon: FileText,
      content: [
        'Address Beauty - furnizorul de servicii și cursuri beauty.',
        'Utilizator/Client - persoana care folosește serviciile noastre.',
        'Servicii - cursurile, produsele și serviciile beauty oferite.',
        'Site - platforma web addressbeauty.md și aplicațiile asociate.'
      ],
      contentRu: [
        'Address Beauty - поставщик beauty услуг и курсов.',
        'Пользователь/Клиент - лицо, использующее наши услуги.',
        'Услуги - курсы, продукты и beauty услуги, которые мы предлагаем.',
        'Сайт - веб-платформа addressbeauty.md и связанные приложения.'
      ]
    },
    {
      title: 'Acordul de Utilizare',
      titleRu: 'Соглашение об Использовании',
      icon: Shield,
      content: [
        'Prin accesarea și utilizarea serviciilor noastre, acceptați acești termeni.',
        'Termenii pot fi modificați periodic cu notificare prealabilă.',
        'Utilizarea continuă echivalează cu acceptarea modificărilor.',
        'Pentru cursuri, se aplică și termenii specifici fiecărui program.'
      ],
      contentRu: [
        'Получая доступ и используя наши услуги, вы принимаете эти условия.',
        'Условия могут быть изменены периодически с предварительным уведомлением.',
        'Продолжение использования равнозначно принятию изменений.',
        'Для курсов также действуют специфические условия каждой программы.'
      ]
    },
    {
      title: 'Servicii și Cursuri',
      titleRu: 'Услуги и Курсы',
      icon: FileText,
      content: [
        'Cursurile sunt structurate și livrate conform programei anunțate.',
        'Ne rezervăm dreptul de a modifica programul cu 48h înainte.',
        'Certificatele sunt emise doar la finalizarea completă a cursului.',
        'Suportul post-curs este oferit conform termenilor specifici.'
      ],
      contentRu: [
        'Курсы структурированы и проводятся согласно объявленной программе.',
        'Мы оставляем за собой право изменить программу за 48 часов.',
        'Сертификаты выдаются только при полном завершении курса.',
        'Послекурсовая поддержка предоставляется согласно специфическим условиям.'
      ]
    },
    {
      title: 'Plăți și Rambursări',
      titleRu: 'Платежи и Возвраты',
      icon: AlertTriangle,
      content: [
        'Plățile se efectuează conform metodelor acceptate pe site.',
        'Pentru cursuri: rambursare 100% cu 7 zile înainte de început.',
        'Pentru produse: retur în 14 zile pentru produse nedesfăcute.',
        'Costurile de transport pentru retur sunt suportate de client.'
      ],
      contentRu: [
        'Платежи осуществляются согласно принятым на сайте методам.',
        'Для курсов: 100% возврат за 7 дней до начала.',
        'Для продуктов: возврат в течение 14 дней для нераспакованных товаров.',
        'Транспортные расходы за возврат несет клиент.'
      ]
    },
    {
      title: 'Propriatea Intelectuală',
      titleRu: 'Интеллектуальная Собственность',
      icon: Shield,
      content: [
        'Toate materialele cursurilor sunt proprietatea Address Beauty.',
        'Este interzisă reproducerea sau distribuirea fără acordul scris.',
        'Utilizarea comercială a materialelor necesită licență separată.',
        'Marca "Address Beauty" este protejată legal.'
      ],
      contentRu: [
        'Все материалы курсов являются собственностью Address Beauty.',
        'Запрещено воспроизведение или распространение без письменного согласия.',
        'Коммерческое использование материалов требует отдельной лицензии.',
        'Торговая марка "Address Beauty" защищена законом.'
      ]
    },
    {
      title: 'Limitarea Responsabilității',
      titleRu: 'Ограничение Ответственности',
      icon: AlertTriangle,
      content: [
        'Address Beauty nu este responsabilă pentru rezultatele comerciale ale absolvenților.',
        'Informațiile furnizate sunt pentru scop educațional.',
        'Clientul este responsabil pentru aplicarea corectă a cunoștințelor.',
        'Nu garantăm succesul comercial în urma cursurilor.'
      ],
      contentRu: [
        'Address Beauty не несет ответственности за коммерческие результаты выпускников.',
        'Предоставляемая информация предназначена для образовательных целей.',
        'Клиент несет ответственность за правильное применение знаний.',
        'Мы не гарантируем коммерческий успех после курсов.'
      ]
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
            {language === 'RO' ? 'Termeni și Condiții' : 'Условия использования'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {language === 'RO' 
              ? 'Termenii și condițiile generale de utilizare a serviciilor Address Beauty. Actualizat la 11 iulie 2025.'
              : 'Общие условия использования услуг Address Beauty. Обновлено 11 июля 2025 года.'
            }
          </p>
        </div>
      </section>

      {/* Content */}
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

          {/* Contact */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                {language === 'RO' ? 'Ai întrebări?' : 'Есть вопросы?'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'RO' 
                  ? 'Pentru clarificări suplimentare, nu ezita să ne contactezi.'
                  : 'Для дополнительных разъяснений не стесняйтесь связаться с нами.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/contact">
                    {language === 'RO' ? 'Contactează-ne' : 'Связаться с нами'}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:addressbeauty@mail.ru">
                    {language === 'RO' ? 'Scrie Email' : 'Написать Email'}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {language === 'RO' ? 'Ultima actualizare: 11 iulie 2025' : 'Последнее обновление: 11 июля 2025'}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
