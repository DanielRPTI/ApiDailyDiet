import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function userRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/', async (request, reply) => {
    const creatUserBodySchema = z.object({
      username: z.string(),
      age: z.number(),
    })
    // faz a verificação dos dados inseridos no nosso body da requisição
    const { username, age } = creatUserBodySchema.parse(request.body)

    // Insere um coockie toda vez que é criado um usuario, é setado automaticamente um coockie

    const userId = randomUUID()
    // cria um cookie com o nome user_id recebendo o dado do userId acima
    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day to expire
    })

    await knex('users').insert({
      id: userId,
      username,
      age,
    })

    return reply.status(201).send()
  })
}
