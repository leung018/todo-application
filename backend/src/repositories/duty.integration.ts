import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { PostgresDutyRepository } from './duty'
import { newPostgresContextFromEnv } from './util'

describe('PostgresDutyRepository', () => {
  let repo: PostgresDutyRepository

  beforeAll(async () => {
    repo = await PostgresDutyRepository.create(newPostgresContextFromEnv())
  })

  it('should list empty duties when no any is created', async () => {
    const duties = await repo.listDuties()
    expect(duties).toEqual([])
  })

  afterAll(async () => {
    repo.close()
  })
})
