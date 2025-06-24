import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PRETIUM_BASE_URI = process.env.PRETIUM_BASE_URI;
const PRETIUM_API_KEY = process.env.PRETIUM_API_KEY;

// Helper function to create axios instance with default headers

const createPretiumAxios = () => {

  // Log environment variables for debugging (without exposing the API key)
  
  console.log('🔧 Pretium Config:', {
    baseURI: PRETIUM_BASE_URI || 'NOT_SET',
    apiKeyPresent: !!PRETIUM_API_KEY,
    apiKeyLength: PRETIUM_API_KEY ? PRETIUM_API_KEY.length : 0
  });

  if (!PRETIUM_BASE_URI) {
    throw new Error('PRETIUM_BASE_URI environment variable is not set');
  }
  
  if (!PRETIUM_API_KEY) {
    throw new Error('PRETIUM_API_KEY environment variable is not set');
  }

  return axios.create({
    baseURL: PRETIUM_BASE_URI,
    headers: {
      'x-api-key': PRETIUM_API_KEY,
      'Content-Type': 'application/json'
    }
  });
};

// Get Exchange Rates
export const getExchangeRate = async (req, res) => {
  try {
    console.log('📊 Getting exchange rate - Received payload:', req.body);
    
    const { currency_code } = req.body;
    
    if (!currency_code) {
      console.log('❌ Exchange rate failed - No currency code provided');
      return res.status(400).json({ error: 'Currency code is required' });
    }

    const pretiumAxios = createPretiumAxios();
    const response = await pretiumAxios.post('/v1/exchange-rate', {
      currency_code
    });

    console.log('✅ Exchange rate retrieved successfully:', response.data);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Exchange rate error details:', {
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? { ...error.config.headers, 'x-api-key': '[HIDDEN]' } : undefined
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Failed to get exchange rate'
    });
  }
};

// Validate mobile number, merchant code, or bank account
export const validateAccount = async (req, res) => {
  try {
    console.log('🔍 Validating account - Received payload:', req.body);
    
    const { type, shortcode, mobile_network, account_number, bank_code } = req.body;
    const { currency } = req.params; // For markets other than Kenya
    
    if (!type) {
      console.log('❌ Validation failed - No type provided');
      return res.status(400).json({ error: 'Type is required' });
    }

    // Build validation endpoint URL
    let endpoint = '/v1/validation';
    if (currency && currency !== 'KES') {
      endpoint += `/${currency}`;
    }

    const pretiumAxios = createPretiumAxios();
    const response = await pretiumAxios.post(endpoint, req.body);

    console.log('✅ Account validation successful:', response.data);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Validation error details:', {
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? { ...error.config.headers, 'x-api-key': '[HIDDEN]' } : undefined
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Failed to validate account'
    });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    console.log('💳 Processing payment - Received payload:', req.body);
    
    const { 
      transaction_hash, 
      amount, 
      shortcode, 
      account_number, 
      type, 
      mobile_network,
      account_name,
      bank_name,
      bank_code,
      callback_url,
      chain 
    } = req.body;
    
    const { currency } = req.params; // For markets other than Kenya
    
    if (!transaction_hash || !amount) {
      console.log('❌ Payment failed - Missing required fields');
      return res.status(400).json({ 
        error: 'Transaction hash and amount are required' 
      });
    }

    // Build payment endpoint URL
    let endpoint = '/v1/pay';
    if (currency && currency !== 'KES') {
      endpoint += `/${currency}`;
    }

    const pretiumAxios = createPretiumAxios();
    const response = await pretiumAxios.post(endpoint, req.body);

    console.log('✅ Payment processed successfully:', response.data);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Payment processing error details:', {
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? { ...error.config.headers, 'x-api-key': '[HIDDEN]' } : undefined
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Failed to process payment'
    });
  }
};

// Get supported banks (NGN market)
export const getBanks = async (req, res) => {
  try {
    console.log('🏦 Getting supported banks');
    
    const pretiumAxios = createPretiumAxios();
    const response = await pretiumAxios.post('/v1/banks');

    console.log('✅ Banks retrieved successfully:', response.data);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Banks retrieval error details:', {
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? { ...error.config.headers, 'x-api-key': '[HIDDEN]' } : undefined
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Failed to get banks'
    });
  }
};

// Check transaction status
export const getTransactionStatus = async (req, res) => {
  try {
    console.log('📋 Getting transaction status - Received payload:', req.body);
    
    const { transaction_code } = req.body;
    const { currency } = req.params; // For markets other than Kenya
    
    if (!transaction_code) {
      console.log('❌ Status check failed - No transaction code provided');
      return res.status(400).json({ error: 'Transaction code is required' });
    }

    // Build status endpoint URL
    let endpoint = '/v1/status';
    if (currency && currency !== 'KES') {
      endpoint += `/${currency}`;
    }

    const pretiumAxios = createPretiumAxios();
    const response = await pretiumAxios.post(endpoint, {
      transaction_code
    });

    console.log('✅ Transaction status retrieved successfully:', response.data);
    res.json({ success: true, data: response.data });

  } catch (error) {
    console.error('❌ Status check error details:', {
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? { ...error.config.headers, 'x-api-key': '[HIDDEN]' } : undefined
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Failed to get transaction status'
    });
  }
}; 