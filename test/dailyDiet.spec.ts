import { afterAll, beforeAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'
describe('Meals Process Route', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  it.only('Sould be able to creat a User', async () => {
    await request(app.server)
      .post('/users')
      .send({
        username: 'Daniel Rosa',
        age: 21,
      })
      .expect(201)
  })

  it('Should be able to creat a Meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      username: 'Daniel Rosa',
      age: 21,
    })

    const userId = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', userId)
      .send({
        user_id: userId,
        name: 'Jantar',
        description: 'Arroz, salada, feijao e frango',
        within_diet: true,
        consumed_at: '2023-11-21 10:40:00',
      })
      .expect(201)
  })
})
