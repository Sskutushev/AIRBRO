export const env = {
  NODE_ENV: 'test',
  PORT: 3001,
  FRONTEND_URL: 'http://localhost:5173',
  DATABASE_URL: 'file:./prisma/dev.db',
  JWT_SECRET: 'dummy_jwt_secret_for_testing_environment_1234567890',
  JWT_EXPIRES_IN: '1d',
};

export const validateEnvironment = () => env;
