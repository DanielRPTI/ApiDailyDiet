/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkUserId } from '../middlewares/check-user-id'
import { randomUUID } from 'crypto'

export async function dailyDietRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserId)
  // Lista todas as refeições cadastradas
  app.get('/', async (request, reply) => {
    const { userId } = request.cookies
    const listAllMealsCreated = await knex('meals')
      .where('user_id', userId)
      .select('*')

    return {
      listAllMealsCreated,
    }
  })

  // Criação de dados para a tabela Meals
  app.post('/', async (request, reply) => {
    // pega o cookie de identificação de sessão do usuario
    const { userId } = request.cookies

    // Tipagem dos dados presente no corpo da requisição
    const creatMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      within_diet: z.boolean(),
      consumed_at: z.string(),
    })

    const { name, description, within_diet, consumed_at } =
      creatMealBodySchema.parse(request.body)

    // Cria na tabela uma refeição feita por um determinado usuario:

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      within_diet,
      user_id: userId,
      consumed_at,
    })
    return reply.status(201).send()
  })
}
