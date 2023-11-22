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

    const { username, age } = creatUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      username,
      age,
    })

    return reply.status(201).send()
  })
}
