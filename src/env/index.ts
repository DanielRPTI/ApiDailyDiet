import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}
// Cria a tipagem para todas as enverioment variables para utilizar de uma forma mais facíl o typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
})

// Usando o SafePArse para tratar os erros e validar os mesmo de uma forma melhor:
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error('⚠️ Invalid env variables')
}

export const env = _env.data
