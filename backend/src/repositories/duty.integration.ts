import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals'
import { PostgresDutyRepository } from './duty'
import { newPostgresContextFromEnv } from './util'
import { Duty } from '../models/duty'

describe('PostgresDutyRepository', () => {
  let repo: PostgresDutyRepository

  beforeAll(async () => {
    repo = await PostgresDutyRepository.create(newPostgresContextFromEnv())
  })

  beforeEach(async () => {
    await repo.sql`DELETE FROM duties` // TODO: clean up through the repository instead of directly
  })

  it('should list empty duties when no any is created', async () => {
    const duties = await repo.listDuties()
    expect(duties).toEqual([])
  })

  it('should list created duties same as order they added', async () => {
    const duty1 = Duty.createNull({ name: 'duty Z' })
    const duty2 = Duty.createNull({ name: 'duty X' })

    await repo.create(duty1)
    await repo.create(duty2)

    const duties = await repo.listDuties()
    expect(duties).toEqual([duty1, duty2])
  })

  it('should deleteAllDuties remove created duties', async () => {
    const duty1 = Duty.createNull()
    const duty2 = Duty.createNull()

    await repo.create(duty1)
    await repo.create(duty2)

    await repo.deleteAllDuties()

    const duties = await repo.listDuties()
    expect(duties).toEqual([])
  })

  afterAll(async () => {
    repo.close()
  })
})
