/**
 * MAIB eCommerce Payment Service
 * Integrare cu MAIB eCommerce NEW API
 * Documentație: https://docs.maibmerchants.md/
 */

export interface MaibPaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  orderDescription: string;
  customerEmail: string;
  customerPhone?: string;
  customerName: string;
  callbackUrl: string;
  redirectUrl: string;
}

export interface MaibPaymentResponse {
  orderId: string;
  payId: string;
  formUrl: string;
  redirectUrl: string;
}

export interface MaibCallbackData {
  orderId: string;
  payId: string;
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
}

// Configurație MAIB - folosim datele de test
const MAIB_CONFIG = {
  projectId: import.meta.env.VITE_MAIB_PROJECT_ID || '9B9C19AE-DC32-4128-9249-16412CCD7E6B',
  projectSecret: import.meta.env.VITE_MAIB_PROJECT_SECRET || 'efb8506c-0afb-4430-8e33-5b0336a18ccf',
  signatureKey: import.meta.env.VITE_MAIB_SIGNATURE_KEY || '4fa8f893-7f39-4f13-b5c2-34e6629b84dc',
  apiUrl: import.meta.env.VITE_MAIB_API_URL || 'https://api.maibmerchants.md',
  isTestMode: import.meta.env.VITE_MAIB_TEST_MODE !== 'false', // Default true pentru test
};

class MaibPaymentService {
  /**
   * Generează semnătura pentru request-uri MAIB
   */
  private generateSignature(data: Record<string, any>): string {
    // Sortăm cheile alfabetic
    const sortedKeys = Object.keys(data).sort();
    const signatureString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    // Adăugăm secret key
    const fullString = `${signatureString}&key=${MAIB_CONFIG.signatureKey}`;
    
    // Hash SHA256 (în producție, folosim o librărie crypto)
    // Pentru moment, returnăm un hash simplu - în producție folosim crypto.subtle
    return btoa(fullString).substring(0, 64); // Placeholder - va fi înlocuit cu hash real
  }

  /**
   * Creează o sesiune de plată în MAIB
   */
  async createPaymentSession(request: MaibPaymentRequest): Promise<MaibPaymentResponse> {
    try {
      const orderData = {
        projectId: MAIB_CONFIG.projectId,
        amount: request.amount,
        currency: request.currency,
        orderId: request.orderId,
        orderDescription: request.orderDescription,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone || '',
        customerName: request.customerName,
        callbackUrl: request.callbackUrl,
        redirectUrl: request.redirectUrl,
        timestamp: new Date().toISOString(),
      };

      // Generăm semnătura
      const signature = this.generateSignature(orderData);
      orderData.signature = signature;

      // Facem request către API-ul MAIB
      const response = await fetch(`${MAIB_CONFIG.apiUrl}/api/v1/payment/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAIB_CONFIG.projectSecret}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        orderId: data.orderId,
        payId: data.payId,
        formUrl: data.formUrl || data.redirectUrl,
        redirectUrl: request.redirectUrl,
      };
    } catch (error) {
      console.error('MAIB Payment Error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Eroare la crearea sesiunii de plată MAIB'
      );
    }
  }

  /**
   * Verifică statusul unei plăți
   */
  async checkPaymentStatus(payId: string): Promise<MaibCallbackData> {
    try {
      const response = await fetch(`${MAIB_CONFIG.apiUrl}/api/v1/payment/status/${payId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAIB_CONFIG.projectSecret}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        orderId: data.orderId,
        payId: data.payId,
        status: data.status,
        transactionId: data.transactionId,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
      };
    } catch (error) {
      console.error('MAIB Status Check Error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Eroare la verificarea statusului plății'
      );
    }
  }

  /**
   * Procesează callback-ul de la MAIB
   */
  processCallback(callbackData: Record<string, any>): MaibCallbackData {
    try {
      // Verificăm semnătura
      const receivedSignature = callbackData.signature;
      const dataToVerify = { ...callbackData };
      delete dataToVerify.signature;

      const expectedSignature = this.generateSignature(dataToVerify);

      if (receivedSignature !== expectedSignature) {
        throw new Error('Semnătură invalidă în callback-ul MAIB');
      }

      return {
        orderId: callbackData.orderId,
        payId: callbackData.payId,
        status: callbackData.status,
        transactionId: callbackData.transactionId,
        errorCode: callbackData.errorCode,
        errorMessage: callbackData.errorMessage,
      };
    } catch (error) {
      console.error('MAIB Callback Processing Error:', error);
      throw error;
    }
  }

  /**
   * Returnează URL-ul pentru redirect către formularul de plată MAIB
   */
  getPaymentFormUrl(payId: string): string {
    return `${MAIB_CONFIG.apiUrl}/payment/form/${payId}`;
  }
}

export const maibPaymentService = new MaibPaymentService();

