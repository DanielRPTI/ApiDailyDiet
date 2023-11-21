import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

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
    port: 3000,
  })
  .then(() => {
    console.log('HTTP Server Running...')
  })
