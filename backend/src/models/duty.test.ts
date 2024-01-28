import { describe, it, expect } from '@jest/globals'
import { DutyFactory } from './duty'
import { InvalidArgumentError } from '../utils/errors'

describe('DutyFactory', () => {
  it('should duty be created', () => {
    const duty = createDuty({ name: 'Duty 1' })
    expect(duty.name).toBe('Duty 1')
    expect(typeof duty.id).toBe('string')
  })

  it('should duties be created is different id', () => {
    const duty1 = createDuty()
    const duty2 = createDuty()
    expect(duty1.id).not.toBe(duty2.id)
  })

  it('should prevent empty name', () => {
    expect(() => createDuty({ name: '' })).toThrow(InvalidArgumentError)
    expect(() => createDuty({ name: ' ' })).toThrow(InvalidArgumentError)
  })

  function createDuty({ name = 'Name of Duty' } = {}) {
    return DutyFactory.createDuty({ name })
  }
})
