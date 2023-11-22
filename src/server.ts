import fastify from 'fastify'
import { env } from './env'
import cookies from '@fastify/cookie'
import { dailyDietRoutes } from './routes/dailyDiet'
import { userRoute } from './routes/users'

const app = fastify()

app.register(cookies)
app.register(userRoute, {
  prefix: '/users',
})
app.register(dailyDietRoutes, {
  prefix: '/meals',
})
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running...')
  })
