import postgres from 'postgres'

export interface PostgresContext {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly database: string
}

export function newPostgresClient(context: PostgresContext) {
  return postgres({
    host: context.host,
    port: context.port,
    database: context.database,
    username: context.username,
    password: context.password,
  })
}
