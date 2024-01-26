import { describe, it } from '@jest/globals'
import postgres from 'postgres'

describe('PostgresDutyRepository', () => {
  it('should connect postgres client', async () => {
    // TODO: will remove this test later
    const sql = postgres({
      host: 'localhost',
      port: 5432,
      database: 'admin',
      username: 'admin',
      password: 'mypassword',
    })
    await sql`SELECT 1`
  })
})
