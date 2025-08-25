import dotenv from 'dotenv';

dotenv.config();

export const kycConfig = {
  jumio: {
    apiToken: process.env.JUMIO_API_TOKEN || '',
    apiSecret: process.env.JUMIO_API_SECRET || '',
    baseUrl: process.env.JUMIO_BASE_URL || 'https://netverify.com/api/v4',
    webhookSecret: process.env.JUMIO_WEBHOOK_SECRET || '',
  },
  documentTypes: {
    CARTE_IDENTITE: 'ID_CARD',
    PASSEPORT: 'PASSPORT',
  },
  verificationSettings: {
    maxRetries: 3,
    timeoutMs: 30000,
    riskThresholds: {
      low: 0,
      medium: 30,
      high: 70,
      blocked: 100,
    },
  },
  tunisia: {
    supportedDocuments: ['CARTE_IDENTITE', 'PASSEPORT'],
    countryCode: 'TN',
    language: 'ar', // Arabe pour la Tunisie
  },
};

export const getJumioHeaders = () => ({
  'Authorization': `Basic ${Buffer.from(`${kycConfig.jumio.apiToken}:${kycConfig.jumio.apiSecret}`).toString('base64')}`,
  'Content-Type': 'application/json',
  'User-Agent': 'KOLLECTA-KYC/1.0',
}); 