import fastify from 'fastify'
import cookies from '@fastify/cookie'
import { dailyDietRoutes } from './routes/dailyDiet'
import { userRoute } from './routes/users'

export const app = fastify()

app.register(cookies)
app.register(userRoute, {
  prefix: '/users',
})
app.register(dailyDietRoutes, {
  prefix: '/meals',
})
