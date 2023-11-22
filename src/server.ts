import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

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

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running...')
  })
