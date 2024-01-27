import postgres from 'postgres'

export interface PostgresContext {
  readonly host: string
  readonly port: number
  readonly user: string
  readonly password: string
  readonly database: string
}

export function newPostgresContextFromEnv(): PostgresContext {
  return {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? '5432'),
    user: process.env.POSTGRES_USER ?? 'admin',
    password: process.env.POSTGRES_PASSWORD ?? 'mypassword',
    database: process.env.POSTGRES_DB ?? 'admin',
  }
}

export function newPostgresClient(context: PostgresContext) {
  return postgres({
    host: context.host,
    port: context.port,
    database: context.database,
    user: context.user,
    password: context.password,
  })
}
