import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { dailyDietRoutes } from './routes/dailyDiet'
import { userRoute } from './routes/users'

export const app = fastify()

app.register(cookie)
app.register(userRoute, {
  prefix: '/users',
})
app.register(dailyDietRoutes, {
  prefix: '/meals',
})
