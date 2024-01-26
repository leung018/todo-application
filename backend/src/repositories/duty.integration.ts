import { describe, it, expect, beforeEach } from '@jest/globals'
import { PostgresDutyRepository } from './duty'

describe('PostgresDutyRepository', () => {
  let repo: PostgresDutyRepository

  beforeEach(async () => {
    repo = await PostgresDutyRepository.create({
      host: 'localhost', // TODO: load these config by loader built by .env
      port: 5432,
      database: 'admin',
      username: 'admin',
      password: 'mypassword',
    })
  })

  it('should list empty duties when no any is created', async () => {
    const duties = await repo.listDuties()
    expect(duties).toEqual([])
  })
})
