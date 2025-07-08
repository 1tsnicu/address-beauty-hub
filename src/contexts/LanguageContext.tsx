import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'RO' | 'RU';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  RO: {
    // Header
    'header.home': 'Acasă',
    'header.shop': 'Magazin online',
    'header.courses': 'Cursuri',
    'header.delivery': 'Livrare / Achitare',
    'header.contact': 'Contact',
    'header.cart': 'Coș',
    'header.account': 'Contul meu',
    'header.register': 'Înregistrare',
    'header.login': 'Autentificare',
    'header.motto': 'Inspirație, educație și produse într-un singur loc!',
    
    // Homepage
    'home.hero.title': 'Adress Beauty',
    'home.hero.motto': 'Inspirație, educație și produse într-un singur loc!',
    'home.hero.shop': 'Magazin Online',
    'home.hero.courses': 'Cursuri Profesionale',
    'home.hero.contact': 'Contacte',
    'home.why.title': 'De ce să alegi Adress Beauty?',
    'home.why.subtitle': 'Suntem mai mult decât un brand – suntem o misiune de a oferi cele mai bune produse și servicii beauty din Moldova.',
    'home.shop.title': 'Magazin Profesional',
    'home.shop.description': 'Peste 1000 de produse premium pentru extensii de gene, sprâncene și cosmetice profesionale.',
    'home.shop.button': 'Explorează Produsele',
    'home.education.title': 'Educație de Calitate',
    'home.education.description': '6 programe de cursuri, de la începători la nivel profesional. Diplomă recunoscută și suport continuu.',
    'home.education.button': 'Vezi Cursurile',
    'home.services.title': 'Servicii Salon',
    'home.services.description': 'Servicii profesionale în salonul nostru fizic cu cele mai noi tehnici și produse premium.',
    'home.services.button': 'Programează-te',
    'home.cta.title': 'Începe transformarea ta profesională astăzi',
    'home.cta.subtitle': 'Alătură-te comunității noastre de profesioniști beauty și descoperă tot ce ai nevoie pentru succesul tău.',
    'home.cta.course': 'Rezervă un Curs',
    'home.cta.products': 'Explorează Produsele',
    
    // Shop
    'shop.title': 'Magazin Online',
    'shop.categories.lashes': 'Gene',
    'shop.categories.brows': 'Sprâncene',
    'shop.categories.lamination': 'Laminarea',
    'shop.categories.cosmetics': 'Cosmetice & îngrijire personală',
    'shop.currency': 'Valută',
    'shop.filters.curve': 'Curbură',
    'shop.filters.length': 'Lungime',
    'shop.filters.thickness': 'Grosime',
    'shop.filters.brand': 'Brand',
    'shop.filters.type': 'Tip',
    'shop.sort.new': 'Noutăți',
    'shop.sort.price_asc': 'Preț (crescător)',
    'shop.sort.price_desc': 'Preț (descrescător)',
    'shop.sort.bestsellers': 'Cele mai vândute',
    'shop.product.add_to_cart': 'Adaugă în coș',
    'shop.product.view_details': 'Vezi detalii',
    'shop.labels.new': 'NOU',
    'shop.labels.sale': 'Reducere',
    'shop.labels.limited': 'Stoc limitat',
    
    // Auth
    'auth.login.title': 'Autentificare',
    'auth.register.title': 'Înregistrare',
    'auth.name': 'Nume Prenume',
    'auth.birthdate': 'Data nașterii',
    'auth.phone': 'Nr de telefon',
    'auth.experience.beginner': 'Mester începător (0-1 an)',
    'auth.experience.experienced': 'Mester cu experiență',
    'auth.experience.trainer': 'Trener',
    'auth.instagram': 'Instagram (opțional)',
    'auth.country': 'Țară',
    'auth.city': 'Oraș/Raion',
    'auth.village': 'Sat',
    'auth.address': 'Adresa',
    'auth.bonus.message': 'Felicitări! Ai primit un bonus de 15% pentru prima comandă în următoarele 2 ore!',
    
    // Loyalty
    'loyalty.level1': 'De la 5.001 lei - 5% reducere',
    'loyalty.level2': 'De la 10.001 lei - 6% reducere',
    'loyalty.level3': 'De la 20.001 lei - 7% reducere',
    'loyalty.level4': 'De la 30.001 lei - 8% reducere',
    'loyalty.level5': 'De la 50.001 lei - 10% reducere',
    
    // Courses
    'courses.title': 'Cursuri Beauty',
    'courses.intro1': 'La Adress Beauty credem în puterea educației de calitate.',
    'courses.intro2': 'Cursurile noastre sunt concepute pentru a oferi nu doar informații, ci și o transformare profesională reală.',
    'courses.view_details': 'Vezi Detalii',
    'courses.coming_soon': 'În curând',
    'courses.book_visit': 'Programează o Vizită',
    'courses.comparison': 'Comparație Cursuri',
    'courses.cta.title': 'Gata să-ți începi transformarea profesională?',
    'courses.cta.subtitle': 'Alege cursul potrivit pentru tine și fă primul pas către o carieră de succes în beauty!',
    'courses.call_now': 'Sună acum',
    'courses.email_us': 'Scrie-ne',
    
    // Common
    'common.loading': 'Se încarcă...',
    'common.error': 'Eroare',
    'common.success': 'Success',
    'common.cancel': 'Anulează',
    'common.save': 'Salvează',
    'common.close': 'Închide',
  },
  RU: {
    // Header
    'header.home': 'Главная',
    'header.shop': 'Онлайн магазин',
    'header.courses': 'Курсы',
    'header.delivery': 'Доставка / Оплата',
    'header.contact': 'Контакт',
    'header.cart': 'Корзина',
    'header.account': 'Мой аккаунт',
    'header.register': 'Регистрация',
    'header.login': 'Вход',
    'header.motto': 'Вдохновение, образование и продукты в одном месте!',
    
    // Homepage
    'home.hero.title': 'Adress Beauty',
    'home.hero.motto': 'Вдохновение, образование и продукты в одном месте!',
    'home.hero.shop': 'Онлайн Магазин',
    'home.hero.courses': 'Профессиональные Курсы',
    'home.hero.contact': 'Контакты',
    'home.why.title': 'Почему выбирают Adress Beauty?',
    'home.why.subtitle': 'Мы больше чем бренд – мы миссия по предоставлению лучших продуктов и beauty услуг в Молдове.',
    'home.shop.title': 'Профессиональный Магазин',
    'home.shop.description': 'Более 1000 премиум продуктов для наращивания ресниц, бровей и профессиональной косметики.',
    'home.shop.button': 'Изучить Продукты',
    'home.education.title': 'Качественное Образование',
    'home.education.description': '6 программ курсов, от начинающих до профессионального уровня. Признанный диплом и постоянная поддержка.',
    'home.education.button': 'Посмотреть Курсы',
    'home.services.title': 'Услуги Салона',
    'home.services.description': 'Профессиональные услуги в нашем физическом салоне с новейшими техниками и премиум продуктами.',
    'home.services.button': 'Записаться',
    'home.cta.title': 'Начни свою профессиональную трансформацию сегодня',
    'home.cta.subtitle': 'Присоединяйся к нашему сообществу beauty профессионалов и открой все, что нужно для твоего успеха.',
    'home.cta.course': 'Забронировать Курс',
    'home.cta.products': 'Изучить Продукты',
    
    // Shop
    'shop.title': 'Онлайн Магазин',
    'shop.categories.lashes': 'Ресницы',
    'shop.categories.brows': 'Брови',
    'shop.categories.lamination': 'Ламинирование',
    'shop.categories.cosmetics': 'Косметика и личный уход',
    'shop.currency': 'Валюта',
    'shop.filters.curve': 'Изгиб',
    'shop.filters.length': 'Длина',
    'shop.filters.thickness': 'Толщина',
    'shop.filters.brand': 'Бренд',
    'shop.filters.type': 'Тип',
    'shop.sort.new': 'Новинки',
    'shop.sort.price_asc': 'Цена (по возрастанию)',
    'shop.sort.price_desc': 'Цена (по убыванию)',
    'shop.sort.bestsellers': 'Бестселлеры',
    'shop.product.add_to_cart': 'Добавить в корзину',
    'shop.product.view_details': 'Подробнее',
    'shop.labels.new': 'НОВИНКА',
    'shop.labels.sale': 'Скидка',
    'shop.labels.limited': 'Ограниченный запас',
    
    // Auth
    'auth.login.title': 'Вход',
    'auth.register.title': 'Регистрация',
    'auth.name': 'Имя Фамилия',
    'auth.birthdate': 'Дата рождения',
    'auth.phone': 'Номер телефона',
    'auth.experience.beginner': 'Начинающий мастер (0-1 год)',
    'auth.experience.experienced': 'Опытный мастер',
    'auth.experience.trainer': 'Тренер',
    'auth.instagram': 'Instagram (необязательно)',
    'auth.country': 'Страна',
    'auth.city': 'Город/Район',
    'auth.village': 'Село',
    'auth.address': 'Адрес',
    'auth.bonus.message': 'Поздравляем! Вы получили бонус 15% на первый заказ в следующие 2 часа!',
    
    // Loyalty
    'loyalty.level1': 'От 5.001 лей - 5% скидка',
    'loyalty.level2': 'От 10.001 лей - 6% скидка',
    'loyalty.level3': 'От 20.001 лей - 7% скидка',
    'loyalty.level4': 'От 30.001 лей - 8% скидка',
    'loyalty.level5': 'От 50.001 лей - 10% скидка',
    
    // Courses
    'courses.title': 'Beauty Курсы',
    'courses.intro1': 'В Adress Beauty мы верим в силу качественного образования.',
    'courses.intro2': 'Наши курсы созданы для того, чтобы предоставить не только информацию, но и реальную профессиональную трансформацию.',
    'courses.view_details': 'Подробнее',
    'courses.coming_soon': 'Скоро',
    'courses.book_visit': 'Записаться на Визит',
    'courses.comparison': 'Сравнение Курсов',
    'courses.cta.title': 'Готов начать свою профессиональную трансформацию?',
    'courses.cta.subtitle': 'Выбери подходящий курс и сделай первый шаг к успешной карьере в beauty!',
    'courses.call_now': 'Звони сейчас',
    'courses.email_us': 'Напиши нам',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.close': 'Закрыть',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('RO');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['RO']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};