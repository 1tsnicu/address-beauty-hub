import { products } from '@/data/products';
import { ProductService, CourseService, CustomerService, Course } from '@/lib/firebaseService';
import { NormalizedCustomer } from '@/types/Customer';

// Import customers data from JSON
import customersData from '@/data/clienti.json';

// Courses data based on your existing CoursesPage
export const coursesData: Omit<Course, 'id'>[] = [
  {
    title: 'Start-Up (3 zile)',
    titleRu: 'Start-Up (3 дня)',
    duration: '3 zile / 21 ore',
    price: {
      eur: 330,
      mdl: 6600
    },
    description: 'Cursul perfect pentru începători care doresc să învețe tehnicile de bază în beauty industry. În doar 3 zile intensive, vei dobândi cunoștințele fundamentale necesare pentru a începe o carieră de succes.',
    descriptionRu: 'Идеальный курс для начинающих, которые хотят изучить основные техники в индустрии красоты. Всего за 3 интенсивных дня вы получите фундаментальные знания, необходимые для начала успешной карьеры.',
    includes: [
      'Manual de lucru complet',
      'Kit de instrumente profesionale pentru început',
      'Certificat de absolvire recunoscut',
      'Suport online timp de 3 luni',
      'Acces la grupul privat de Alumni',
      'Sesiuni practice sub supervizare'
    ],
    includesRu: [
      'Полное руководство по работе',
      'Набор профессиональных инструментов для начинающих',
      'Признанный сертификат об окончании',
      'Онлайн поддержка в течение 3 месяцев',
      'Доступ к частной группе выпускников',
      'Практические занятия под наблюдением'
    ],
    level: 'beginner',
    image: '/placeholder.svg',
    featured: true,
    available: true,
    maxStudents: 12,
    currentStudents: 8,
    certificateIncluded: true,
    practicalHours: 15,
    theoryHours: 6,
    instructor: {
      name: 'Ana Popescu',
      nameRu: 'Анна Попеску',
      experience: '8 ani experiență',
      image: '/placeholder.svg'
    }
  },
  {
    title: 'Next-Up (5 zile)',
    titleRu: 'Next-Up (5 дней)',
    duration: '5 zile / 35 ore',
    price: {
      eur: 550,
      mdl: 11000
    },
    description: 'Program avansat pentru cei care doresc să-și dezvolte abilitățile la următorul nivel. Acest curs comprehensive acoperă tehnici avansate și tendințe moderne în industria beauty.',
    descriptionRu: 'Продвинутая программа для тех, кто хочет развить свои навыки на следующий уровень. Этот комплексный курс охватывает передовые техники и современные тенденции в индустрии красоты.',
    includes: [
      'Manual avansat + ghid de tendințe',
      'Kit profesional complet premium',
      'Certificat de specialist recunoscut internațional',
      'Mentorat personalizat 6 luni',
      'Workshop-uri exclusive lunare',
      'Practică pe modele reale',
      'Business training inclus'
    ],
    includesRu: [
      'Продвинутое руководство + гид по трендам',
      'Полный премиум набор профессионала',
      'Международно признанный сертификат специалиста',
      'Персональное наставничество 6 месяцев',
      'Эксклюзивные ежемесячные мастер-классы',
      'Практика на реальных моделях',
      'Бизнес-тренинг включен'
    ],
    level: 'intermediate',
    image: '/placeholder.svg',
    featured: true,
    available: true,
    maxStudents: 10,
    currentStudents: 6,
    certificateIncluded: true,
    practicalHours: 25,
    theoryHours: 10,
    instructor: {
      name: 'Maria Ionescu',
      nameRu: 'Мария Ионеску',
      experience: '10 ani experiență',
      image: '/placeholder.svg'
    }
  },
  {
    title: 'Academia Lash Pro',
    titleRu: 'Academia Lash Pro',
    duration: '7 zile / 49 ore',
    price: {
      eur: 1500,
      mdl: 30000
    },
    description: 'Cel mai complet program de specializare în extensii de gene. Devino expert certificat cu cel mai prestigios curs din Moldova, recunoscut la nivel european.',
    descriptionRu: 'Самая полная программа специализации по наращиванию ресниц. Станьте сертифицированным экспертом с самым престижным курсом в Молдове, признанным на европейском уровне.',
    includes: [
      'Curriculum complet de 7 zile',
      'Kit profesional de lux (valoare 800 EUR)',
      'Certificat Master Lash Artist',
      'Suport nelimitat pe viață',
      'Acces la toate masterclass-urile viitoare',
      'Practică intensivă pe 20+ modele',
      'Pregătire pentru deschiderea propriului salon',
      'Marketing kit pentru promovare'
    ],
    includesRu: [
      'Полная 7-дневная программа',
      'Роскошный профессиональный набор (стоимость 800 EUR)',
      'Сертификат Мастер Лэш Артист',
      'Пожизненная неограниченная поддержка',
      'Доступ ко всем будущим мастер-классам',
      'Интенсивная практика на 20+ моделях',
      'Подготовка к открытию собственного салона',
      'Маркетинговый набор для продвижения'
    ],
    level: 'advanced',
    image: '/placeholder.svg',
    featured: true,
    available: true,
    maxStudents: 8,
    currentStudents: 3,
    certificateIncluded: true,
    practicalHours: 35,
    theoryHours: 14,
    instructor: {
      name: 'Elena Constantinescu',
      nameRu: 'Елена Константинеску',
      experience: '12 ani experiență',
      image: '/placeholder.svg'
    }
  },
  {
    title: 'Laminare Gene',
    titleRu: 'Ламинирование ресниц',
    duration: '2 zile / 14 ore',
    price: {
      eur: 280,
      mdl: 5600
    },
    description: 'Specializare în tehnica modernă de laminare a genelor. Învață să oferi clienților o alternativă naturală la extensiile de gene, cu rezultate spectaculoase.',
    descriptionRu: 'Специализация по современной технике ламинирования ресниц. Научитесь предлагать клиентам естественную альтернативу наращиванию ресниц с впечатляющими результатами.',
    includes: [
      'Curs intensiv de 2 zile',
      'Kit complet pentru laminare',
      'Certificat de specialist în laminare',
      'Suport tehnic 6 luni',
      'Ghid de prețuri și marketing',
      'Practică pe modele voluntare'
    ],
    includesRu: [
      'Интенсивный 2-дневный курс',
      'Полный набор для ламинирования',
      'Сертификат специалиста по ламинированию',
      'Техническая поддержка 6 месяцев',
      'Руководство по ценам и маркетингу',
      'Практика на моделях-волонтерах'
    ],
    level: 'intermediate',
    image: '/placeholder.svg',
    featured: false,
    available: true,
    maxStudents: 8,
    currentStudents: 5,
    certificateIncluded: true,
    practicalHours: 10,
    theoryHours: 4,
    instructor: {
      name: 'Cristina Radu',
      nameRu: 'Кристина Раду',
      experience: '6 ani experiență',
      image: '/placeholder.svg'
    }
  },
  {
    title: 'Microblading Sprâncene',
    titleRu: 'Микроблейдинг бровей',
    duration: '4 zile / 28 ore',
    price: {
      eur: 750,
      mdl: 15000
    },
    description: 'Cursul complet de microblading pentru sprâncene. Învață tehnica semi-permanentă cea mai căutată în industria beauty din ultimii ani.',
    descriptionRu: 'Полный курс микроблейдинга бровей. Изучите самую востребованную полуперманентную технику в индустрии красоты последних лет.',
    includes: [
      'Program de 4 zile cu teorie și practică',
      'Kit profesional microblading',
      'Certificat internațional',
      'Suport post-curs 1 an',
      'Sesiuni de perfecționare gratuite',
      'Practică pe piele artificială și modele'
    ],
    includesRu: [
      '4-дневная программа с теорией и практикой',
      'Профессиональный набор для микроблейдинга',
      'Международный сертификат',
      'Поддержка после курса 1 год',
      'Бесплатные сессии усовершенствования',
      'Практика на искусственной коже и моделях'
    ],
    level: 'advanced',
    image: '/placeholder.svg',
    featured: false,
    available: true,
    maxStudents: 6,
    currentStudents: 2,
    certificateIncluded: true,
    practicalHours: 20,
    theoryHours: 8,
    instructor: {
      name: 'Alina Moraru',
      nameRu: 'Алина Морару',
      experience: '9 ani experiență',
      image: '/placeholder.svg'
    }
  },
  {
    title: 'Machiaj Profesional',
    titleRu: 'Профессиональный макияж',
    duration: '6 zile / 42 ore',
    price: {
      eur: 650,
      mdl: 13000
    },
    description: 'Curs complet de machiaj profesional. De la tehnicile de bază la look-urile avant-garde, vei învăța să creezi machiaje pentru orice ocazie.',
    descriptionRu: 'Полный курс профессионального макияжа. От базовых техник до авангардных образов, вы научитесь создавать макияж для любого случая.',
    includes: [
      'Cursul complet de 6 zile',
      'Kit profesional de machiaj premium',
      'Certificat de makeup artist',
      'Portfolio fotografic inclus',
      'Acces la evenimentele de networking',
      'Practică pe diverse tipuri de ten'
    ],
    includesRu: [
      'Полный 6-дневный курс',
      'Премиум профессиональный набор для макияжа',
      'Сертификат визажиста',
      'Фотопортфолио включено',
      'Доступ к нетворкинг мероприятиям',
      'Практика на различных типах кожи'
    ],
    level: 'intermediate',
    image: '/placeholder.svg',
    featured: false,
    available: true,
    maxStudents: 10,
    currentStudents: 7,
    certificateIncluded: true,
    practicalHours: 30,
    theoryHours: 12,
    instructor: {
      name: 'Diana Stanciu',
      nameRu: 'Диана Станчу',
      experience: '11 ani experiență',
      image: '/placeholder.svg'
    }
  }
];

// Function to seed all data
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Seed products
    console.log('📦 Seeding products...');
    const productIds = await ProductService.addProducts(
      products.map(product => {
        const { id, ...productWithoutId } = product;
        return productWithoutId;
      })
    );
    console.log(`✅ Added ${productIds.length} products`);
    
    // Seed courses
    console.log('🎓 Seeding courses...');
    const courseIds = await CourseService.addCourses(coursesData);
    console.log(`✅ Added ${courseIds.length} courses`);
    
    // Seed customers
    console.log('👥 Seeding customers...');
    const normalizedCustomers = customersData
      .filter(customer => customer["Наименование"]) // Filter out invalid entries
      .map(customer => CustomerService.normalizeCustomer(customer));
    
    const customerIds = await CustomerService.addCustomers(normalizedCustomers);
    console.log(`✅ Added ${customerIds.length} customers`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    return {
      products: productIds.length,
      courses: courseIds.length,
      customers: customerIds.length
    };
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Function to check if database is empty
export const isDatabaseEmpty = async (): Promise<boolean> => {
  try {
    const products = await ProductService.getAllProducts();
    const courses = await CourseService.getAllCourses();
    const customers = await CustomerService.getAllCustomers();
    
    return products.length === 0 && courses.length === 0 && customers.length === 0;
  } catch (error) {
    console.error('Error checking database status:', error);
    return true; // Assume empty if there's an error
  }
};
