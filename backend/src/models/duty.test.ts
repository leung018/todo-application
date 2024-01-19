import { describe, it, expect } from '@jest/globals'
import { DutyFactory } from './duty'

describe('DutyFactory', () => {
  it('should duty be created', () => {
    const duty = DutyFactory.createDuty({ name: 'Duty 1' })
    expect(duty.name).toBe('Duty 1')
    expect(typeof duty.id).toBe('string')
  })
})
