// backend/src/config/__mocks__/environment.ts
export const env = {
  NODE_ENV: 'test',
  PORT: 3000,
  FRONTEND_URL: 'http://localhost:5173',
  DATABASE_URL: 'postgresql://airbro:airbro_dev@localhost:5432/airbro_test',
  JWT_SECRET: 'supersecretjwtkeyfor_testing_only_12345',
  JWT_EXPIRES_IN: '7d',
  TELEGRAM_BOT_TOKEN: undefined,
  TELEGRAM_ADMIN_CHANNEL: undefined,
  USDT_TRC20_WALLET: undefined,
  USDT_ERC20_WALLET: undefined,
  TON_WALLET: undefined,
  RUB_TO_USDT_RATE: 95.5,
  RUB_TO_TON_RATE: 15.2,
};

export const validateEnvironment = () => env;
export default env;