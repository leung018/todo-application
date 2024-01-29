import { describe, it, expect } from '@jest/globals'
import { Duty } from './duty'
import { InvalidArgumentError } from '../utils/errors'

describe('Duty', () => {
  it('should duty be created', () => {
    const duty = Duty.createNull({ name: 'Duty 1' })
    expect(duty.name).toBe('Duty 1')
    expect(typeof duty.id).toBe('string')
  })

  it('should duties be created is different id', () => {
    const duty1 = Duty.createNull()
    const duty2 = Duty.createNull()
    expect(duty1.id).not.toBe(duty2.id)
  })

  it('should prevent empty name', () => {
    expect(() => Duty.createNull({ name: '' })).toThrow(InvalidArgumentError)
    expect(() => Duty.createNull({ name: ' ' })).toThrow(InvalidArgumentError)
  })

  it('should prevent extremely long name', () => {
    const name = 'a'.repeat(251)
    expect(() => Duty.createNull({ name })).toThrow(InvalidArgumentError)
  })
})
