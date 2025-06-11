// Frontend Pretium API client (calls your Express.js backend)
// This avoids CORS issues and keeps API keys secure on your server

interface ExchangeRateRequest {
  currency_code: string;
}

interface ExchangeRateResponse {
  rate: number;
  currency_code: string;
}

interface ValidationRequest {
  type: 'MOBILE' | 'PAYBILL' | 'BUY_GOODS';
  shortcode: string;
  mobile_network?: string;
  account_number?: string;
  bank_code?: string;
}

interface ValidationResponse {
  success: boolean;
  data: {
    code: number;
    message: string;
    data: {
      status: string;
      shortcode: string;
      public_name: string;
      mobile_network: string;
      business_name?: string; // For PAYBILL validation
    };
  };
}

interface PaymentRequest {
  transaction_hash: string;
  amount: string;
  shortcode?: string;
  type?: 'MOBILE' | 'PAYBILL' | 'BUY_GOODS';
  mobile_network?: string;
  account_number?: string;
  account_name?: string;
  bank_name?: string;
  bank_code?: string;
  callback_url?: string;
  chain?: 'CELO' | 'BASE';
}

interface PaymentResponse {
  success: boolean;
  transaction_code: string;
  message: string;
}

interface StatusRequest {
  transaction_code: string;
}

interface StatusResponse {
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message: string;
}

interface Bank {
  bank_code: string;
  bank_name: string;
}

class PretiumAPI {
  private baseUrl: string;

  constructor() {
    // Use your Express.js backend API
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseUrl}/api/pretium${endpoint}`;
    
    // console.log(`🌐 Calling backend API: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async getExchangeRate(currencyCode: string): Promise<ExchangeRateResponse> {
    const data: ExchangeRateRequest = {
      currency_code: currencyCode,
    };
    return this.makeRequest('/exchange-rate', data);
  }

  async validateRecipient(validationData: ValidationRequest, currency?: string): Promise<ValidationResponse> {
    const endpoint = currency ? `/validation/${currency}` : '/validation';
    return this.makeRequest(endpoint, validationData);
  }

  async initiatePayment(paymentData: PaymentRequest, currency?: string): Promise<PaymentResponse> {
    const endpoint = currency ? `/pay/${currency}` : '/pay';
    return this.makeRequest(endpoint, paymentData);
  }

  async checkPaymentStatus(transactionCode: string, currency?: string): Promise<StatusResponse> {
    const endpoint = currency ? `/status/${currency}` : '/status';
    const data: StatusRequest = {
      transaction_code: transactionCode,
    };
    return this.makeRequest(endpoint, data);
  }

  async getSupportedBanks(): Promise<Bank[]> {
    return this.makeRequest('/banks', {});
  }

  getSettlementWallet(): string {
    // This should be provided by your backend or environment
    return process.env.NEXT_PUBLIC_PRETIUM_SETTLEMENT_WALLET || '0x0000000000000000000000000000000000000000';
  }

  // Helper method to calculate fiat equivalent
  async calculateFiatEquivalent(stablecoinAmount: string, currencyCode: string): Promise<number> {
    const rate = await this.getExchangeRate(currencyCode);
    return parseFloat(stablecoinAmount) * rate.rate;
  }
}

export const pretiumAPI = new PretiumAPI();

export type {
  ExchangeRateRequest,
  ExchangeRateResponse,
  ValidationRequest,
  ValidationResponse,
  PaymentRequest,
  PaymentResponse,
  StatusRequest,
  StatusResponse,
  Bank,
};

// Supported countries and their currency codes
export const SUPPORTED_COUNTRIES = {
  KES: { name: 'Kenya', currency: 'KES', networks: ['Safaricom', 'Airtel'] },
  UGX: { name: 'Uganda', currency: 'UGX', networks: ['MTN', 'Airtel'] },
  GHS: { name: 'Ghana', currency: 'GHS', networks: ['AirtelTigo', 'MTN'] },
  NGN: { name: 'Nigeria', currency: 'NGN', networks: [] }, // Bank transfers only
};

export const MOBILE_NETWORKS = {
  Safaricom: 'Safaricom',
  Airtel: 'Airtel', 
  MTN: 'MTN',
  AirtelTigo: 'AirtelTigo',
  Telcel: 'Telcel',
}; 