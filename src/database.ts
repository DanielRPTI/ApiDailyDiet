import { knex as setupKnex } from 'knex'
import { env } from './env'

const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
})
