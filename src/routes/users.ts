import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID, randomUUID } from 'node:crypto'

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

    await knex('users').insert({
      id: randomUUID(),
      username,
      age,
    })

    return reply.status(201).send()
  })
}
