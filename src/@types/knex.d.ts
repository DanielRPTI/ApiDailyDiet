// eslint-disable-next-line
import { Knex } from 'knex'

// Tipagem do Ts das tables usando knex
declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      age: number
      created_at: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      consumed_at: string
      within_diet: boolean
    }
  }
}
