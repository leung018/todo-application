import { PostgresContext, newPostgresContextFromEnv } from './repositories/util'

export interface ApplicationContext {
  readonly postgresContext: PostgresContext
}

export function newApplicationContextFromEnv(): ApplicationContext {
  return {
    postgresContext: newPostgresContextFromEnv(),
  }
}
