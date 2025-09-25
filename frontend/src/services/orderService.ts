import { supabase } from '@/lib/supabaseClient';

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  variants?: Record<string, string>;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export interface DeliveryInfo {
  method: 'standard' | 'express' | 'pickup';
  price: number;
}

export interface PaymentInfo {
  method: 'card' | 'cash' | 'transfer';
}

export interface OrderTotals {
  subtotal: number;
  delivery: number;
  total: number;
}

export interface Order {
  id?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  totals: OrderTotals;
  notes?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

// Funcție helper pentru generarea UUID-urilor
function generateUUID(): string {
  // Fallback pentru browsere care nu suportă crypto.randomUUID()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback pentru browsere mai vechi
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class OrderService {

  /**
   * Creează o comandă nouă în baza de date
   */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderResponse> {
    try {
      // Pregătim datele pentru inserare în baza de date
      const orderRecord = {
        id: generateUUID(), // Generăm ID-ul manual
        customer_first_name: orderData.customer.firstName,
        customer_last_name: orderData.customer.lastName,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        customer_address_street: orderData.customer.address.street,
        customer_address_city: orderData.customer.address.city,
        customer_address_postal_code: orderData.customer.address.postalCode,
        delivery_method: orderData.delivery.method,
        delivery_price: orderData.delivery.price,
        payment_method: orderData.payment.method,
        subtotal: orderData.totals.subtotal,
        delivery_cost: orderData.totals.delivery,
        total_amount: orderData.totals.total,
        notes: orderData.notes || null,
        status: orderData.status,
        items: orderData.items,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Inserăm comanda în tabela orders
      const { data, error } = await supabase
        .from('orders')
        .insert([orderRecord])
        .select()
        .single();

      if (error) {
        console.error('Eroare la crearea comenzii:', error);
        return {
          success: false,
          error: `Eroare la salvarea comenzii: ${error.message}`
        };
      }

      // Construim obiectul Order pentru răspuns
      const createdOrder: Order = {
        id: data.id,
        customer: {
          firstName: data.customer_first_name,
          lastName: data.customer_last_name,
          email: data.customer_email,
          phone: data.customer_phone,
          address: {
            street: data.customer_address_street,
            city: data.customer_address_city,
            postalCode: data.customer_address_postal_code,
          }
        },
        items: data.items,
        delivery: {
          method: data.delivery_method,
          price: data.delivery_price
        },
        payment: {
          method: data.payment_method
        },
        totals: {
          subtotal: data.subtotal,
          delivery: data.delivery_cost,
          total: data.total_amount
        },
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return {
        success: true,
        order: createdOrder
      };

    } catch (error) {
      console.error('Eroare neașteptată la crearea comenzii:', error);
      return {
        success: false,
        error: 'A apărut o eroare neașteptată la procesarea comenzii'
      };
    }
  }

  /**
   * Obține o comandă după ID
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Eroare la obținerea comenzii:', error);
        return {
          success: false,
          error: `Eroare la obținerea comenzii: ${error.message}`
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Comanda nu a fost găsită'
        };
      }

      // Construim obiectul Order
      const order: Order = {
        id: data.id,
        customer: {
          firstName: data.customer_first_name,
          lastName: data.customer_last_name,
          email: data.customer_email,
          phone: data.customer_phone,
          address: {
            street: data.customer_address_street,
            city: data.customer_address_city,
            postalCode: data.customer_address_postal_code,
          }
        },
        items: data.items,
        delivery: {
          method: data.delivery_method,
          price: data.delivery_price
        },
        payment: {
          method: data.payment_method
        },
        totals: {
          subtotal: data.subtotal,
          delivery: data.delivery_cost,
          total: data.total_amount
        },
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return {
        success: true,
        order
      };

    } catch (error) {
      console.error('Eroare neașteptată la obținerea comenzii:', error);
      return {
        success: false,
        error: 'A apărut o eroare neașteptată la obținerea comenzii'
      };
    }
  }

  /**
   * Actualizează statusul unei comenzi
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<OrderResponse> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Eroare la actualizarea statusului comenzii:', error);
        return {
          success: false,
          error: `Eroare la actualizarea statusului: ${error.message}`
        };
      }

      return {
        success: true,
        order: data as any // Simplificat pentru acest exemplu
      };

    } catch (error) {
      console.error('Eroare neașteptată la actualizarea statusului:', error);
      return {
        success: false,
        error: 'A apărut o eroare neașteptată la actualizarea statusului'
      };
    }
  }

  /**
   * Obține toate comenzile unui client (după email)
   */
  async getOrdersByCustomerEmail(email: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Eroare la obținerea comenzilor:', error);
        return {
          success: false,
          error: `Eroare la obținerea comenzilor: ${error.message}`
        };
      }

      // Transformăm datele în obiecte Order
      const orders: Order[] = data.map(item => ({
        id: item.id,
        customer: {
          firstName: item.customer_first_name,
          lastName: item.customer_last_name,
          email: item.customer_email,
          phone: item.customer_phone,
          address: {
            street: item.customer_address_street,
            city: item.customer_address_city,
            postalCode: item.customer_address_postal_code,
            county: item.customer_address_county
          }
        },
        items: item.items,
        delivery: {
          method: item.delivery_method,
          price: item.delivery_price
        },
        payment: {
          method: item.payment_method
        },
        totals: {
          subtotal: item.subtotal,
          delivery: item.delivery_cost,
          total: item.total_amount
        },
        notes: item.notes,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      return {
        success: true,
        orders
      };

    } catch (error) {
      console.error('Eroare neașteptată la obținerea comenzilor:', error);
      return {
        success: false,
        error: 'A apărut o eroare neașteptată la obținerea comenzilor'
      };
    }
  }
}

export const orderService = new OrderService();
