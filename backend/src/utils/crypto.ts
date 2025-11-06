import QRCode from 'qrcode';

// Crypto wallet addresses from environment
const USDT_TRC20_WALLET = process.env.USDT_TRC20_WALLET || 'TYourWalletAddressHere';
const USDT_ERC20_WALLET = process.env.USDT_ERC20_WALLET || '0xYourWalletAddressHere';
const TON_WALLET = process.env.TON_WALLET || 'EQYourTonWalletAddressHere';

// Exchange rates from environment
const RUB_TO_USDT_RATE = parseFloat(process.env.RUB_TO_USDT_RATE || '0.011');
const RUB_TO_TON_RATE = parseFloat(process.env.RUB_TO_TON_RATE || '0.17');

export interface CryptoNetworkConfig {
  wallet: string;
  currency: 'USDT' | 'TON';
  rate: number;
  network: 'TRC20' | 'ERC20' | 'TON';
}

export const getCryptoConfig = (paymentMethod: string): CryptoNetworkConfig => {
  switch (paymentMethod) {
    case 'crypto_usdt_trc20':
      return {
        wallet: USDT_TRC20_WALLET,
        currency: 'USDT',
        rate: RUB_TO_USDT_RATE,
        network: 'TRC20'
      };
    case 'crypto_usdt_erc20':
      return {
        wallet: USDT_ERC20_WALLET,
        currency: 'USDT',
        rate: RUB_TO_USDT_RATE,
        network: 'ERC20'
      };
    case 'crypto_ton':
      return {
        wallet: TON_WALLET,
        currency: 'TON',
        rate: RUB_TO_TON_RATE,
        network: 'TON'
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
  // Convert from kopecks to rubles, then to crypto, then back to "kopecks" for crypto
  const rubValue = rubAmount / 100; // Convert from kopecks to rubles
  const cryptoValue = rubValue * rate;
  return Math.round(cryptoValue * 100); // Return in "kopecks" for crypto amount
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