import { describe, it, expect } from '@jest/globals'
import { Duty } from './duty'
import { InvalidArgumentError } from '../utils/errors'

describe('Duty', () => {
  it('should duty be created', () => {
    const duty = Duty.createTestInstance({ name: 'Duty 1' })
    expect(duty.name).toBe('Duty 1')
    expect(typeof duty.id).toBe('string')
  })

  it('should duties be created is different id', () => {
    const duty1 = Duty.createTestInstance()
    const duty2 = Duty.createTestInstance()
    expect(duty1.id).not.toBe(duty2.id)
  })

  it('should prevent empty name', () => {
    expect(() => Duty.createTestInstance({ name: '' })).toThrow(
      InvalidArgumentError,
    )
    expect(() => Duty.createTestInstance({ name: ' ' })).toThrow(
      InvalidArgumentError,
    )
  })

  it('should prevent extremely long name', () => {
    const name = 'a'.repeat(251)
    expect(() => Duty.createTestInstance({ name })).toThrow(
      InvalidArgumentError,
    )
  })

  it('should expect update of name has same validation as creation', () => {
    const duty = Duty.createTestInstance({ name: 'Original Name' })
    expect(() => (duty.name = ' ')).toThrow(InvalidArgumentError)
    expect(() => (duty.name = 'a'.repeat(251))).toThrow(InvalidArgumentError)

    expect(duty.name).toBe('Original Name')
  })

  it('should update name', () => {
    const duty = Duty.createTestInstance()
    duty.name = 'Updated New Name'
    expect(duty.name).toBe('Updated New Name')
  })

  it('should trim the spaces of input name', () => {
    const duty = Duty.createTestInstance({ name: '  Duty 1  ' })
    expect(duty.name).toBe('Duty 1')

    duty.name = '  Updated Duty   '
    expect(duty.name).toBe('Updated Duty')
  })
})
