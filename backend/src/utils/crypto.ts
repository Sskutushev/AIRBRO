import QRCode from 'qrcode';
import { getRubToUsdRate } from '../services/currencyService';

// Crypto wallet addresses from environment
const USDT_TRC20_WALLET = process.env.USDT_TRC20_WALLET || 'TYourWalletAddressHere';
const USDT_ERC20_WALLET = process.env.USDT_ERC20_WALLET || '0xYourWalletAddressHere';
const TON_WALLET = process.env.TON_WALLET || 'EQYourTonWalletAddressHere';

export interface CryptoNetworkConfig {
  wallet: string;
  currency: 'USDT' | 'TON';
  rate: number;
  network: 'TRC20' | 'ERC20' | 'TON';
}

export const getCryptoConfig = async (paymentMethod: string): Promise<CryptoNetworkConfig> => {
  switch (paymentMethod) {
    case 'crypto_usdt_trc20':
      return {
        wallet: USDT_TRC20_WALLET,
        currency: 'USDT',
        rate: await getRubToUsdRate(),
        network: 'TRC20'
      };
    case 'crypto_usdt_erc20':
      return {
        wallet: USDT_ERC20_WALLET,
        currency: 'USDT',
        rate: await getRubToUsdRate(),
        network: 'ERC20'
      };
    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }
};

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const calculateCryptoAmount = (rubAmount: number, rate: number): number => {
  // Convert from kopecks to rubles, then to crypto
  // The rate is how many RUB for 1 USD. So we need to divide.
  const rubValue = rubAmount / 100; // Convert from kopecks to rubles
  const cryptoValue = rubValue / rate; // Convert RUB to USD(T)
  // We need to round to a reasonable precision for crypto, e.g., 6 decimal places for USDT
  return Math.round(cryptoValue * 1_000_000) / 1_000_000;
};

export const getPaymentWarnings = (): string[] => {
  return [
    "⚠️ ВНИМАНИЕ: Криптовалютные платежи несут риски!",
    "✓ Отправляйте ТОЛЬКО указанную криптовалюту",
    "✓ Тщательно проверьте адрес кошелька",
    "✓ Отправка на неправильный адрес приведет к потере средств",
    "✓ Платеж действителен 30 минут"
  ];
};