// Customer type definition based on your JSON data
export interface Customer {
  id?: string;
  name: string; // Наименование
  phone: string; // Телефон
  email: string; // Email
  birthday: string; // День рождения
  gender: string; // Пол
  description: string; // Описание
  address: string; // адрес
  addedBy: string; // Добавил
  createdAt: string; // Создан
  // Additional fields for better management
  status?: 'active' | 'inactive';
  lastVisit?: string;
  totalOrders?: number;
  totalSpent?: number;
  preferredLanguage?: 'RO' | 'RU';
  tags?: string[];
  notes?: string;
}

// Normalized customer interface for the application
export interface NormalizedCustomer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  gender: 'Мужской' | 'Женский' | 'Masculin' | 'Feminin' | '';
  description: string;
  address: string;
  addedBy: string;
  createdAt: Date;
  status: 'active' | 'inactive';
  lastVisit?: Date;
  totalOrders: number;
  totalSpent: number;
  preferredLanguage: 'RO' | 'RU';
  tags: string[];
  notes: string;
  // Additional properties for customer management
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isActive: boolean;
  avatar?: string;
  registrationDate: Date;
  orderCount: number;
}
