/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserId } from '../middlewares/check-user-id'
import { randomUUID } from 'crypto'

export async function dailyDietRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserId)
  // Lista todas as refeições cadastradas
  app.get('/', async (request, reply) => {
    const { userId } = request.cookies
    const meals = await knex('meals').where('user_id', userId).select('*')
    if (meals.indexOf(0)) {
      return reply.status(400).send({
        message: 'You dont have any meal created, try to insert something!',
      })
    }
    return {
      meals,
    }
  })
  // Lista uma unica refeição com ID
  app.get('/:id', async (request, reply) => {
    const { userId } = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealParamsSchema.parse(request.params)
    const meal = await knex('meals')
      .where({
        user_id: userId,
        id,
      })
      .first()

    return {
      meal,
    }
  })
  // Informa o total de refeições criadas
  app.get('/metrics', async (request, reply) => {
    const { userId } = request.cookies
    const listMeals = await knex('meals').where('user_id', userId)

    const mealsWithinDiet = await knex('meals').where({
      user_id: userId,
      within_diet: true,
    })
    const theBestSequenceDiet = await knex('meals')
      .where({
        user_id: userId,
        within_diet: true,
      })
      .orderBy('consumed_at', 'desc')

    return {
      TotalofMeals: listMeals.length,
      InDietMeals: mealsWithinDiet.length,
      OutOfDietMeals: listMeals.length - mealsWithinDiet.length,
      BestSequence: theBestSequenceDiet,
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
  // Edita uma refeição
  app.put('/:id', async (request, reply) => {
    const { userId } = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealParamsSchema.parse(request.params)

    const updateMealRequest = z.object({
      name: z.string(),
      description: z.string(),
      within_diet: z.boolean(),
      consumed_at: z.string(),
    })
    const { name, description, within_diet, consumed_at } =
      updateMealRequest.parse(request.body)

    const updateMeal = await knex('meals')
      .where({
        user_id: userId,
        id,
      })
      .update({
        name,
        description,
        within_diet,
        consumed_at,
      })
    if (updateMeal === 0) {
      return reply.status(400).send({
        message:
          'Nothing is updated, please try with another id or another value to updated',
      })
    }
    return reply.status(204).send({ message: 'Update succsseful' })
  })

  app.delete('/:id', async (request, reply) => {
    const { userId } = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealParamsSchema.parse(request.params)
    const deleteMeal = await knex('meals')
      .where({
        user_id: userId,
        id,
      })
      .del()
    if (deleteMeal === 0) {
      return reply.status(400).send({
        message:
          'Nothing has been deleted, please try with another id or another value to deleted',
      })
    }
    return reply.status(202).send({
      message: 'Meal  has been deleted',
    })
  })
}
