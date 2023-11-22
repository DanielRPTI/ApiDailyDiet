import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function dailyDietRoutes(app: FastifyInstance) {
  app.get('/user', async () => {
    const user = await knex('users')
      .insert({
        id: crypto.randomUUID(),
        username: 'Daniel',
        age: 21,
      })
      .returning('*')

    return user
  })
}
