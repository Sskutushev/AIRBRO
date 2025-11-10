import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().url().default('file:./prisma/dev.db'),
  JWT_SECRET: z
    .string()
    .min(32, {
      message: 'JWT_SECRET must be at least 32 characters long',
    })
    .default('d5f014ab7534ff7fe23c4f9d761bc640'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Optional Telegram integration
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_CHANNEL: z.string().optional(),

  // Optional crypto wallets
  USDT_TRC20_WALLET: z.string().optional(),
  USDT_ERC20_WALLET: z.string().optional(),
  TON_WALLET: z.string().optional(),

  // Currency rates (optional)
  RUB_TO_USDT_RATE: z.coerce.number().optional(),
  RUB_TO_TON_RATE: z.coerce.number().optional(),
});

type Environment = z.infer<typeof envSchema>;

let validatedEnv: Environment | null = null;

export function validateEnvironment(): Environment {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnvironment();

export default env;
