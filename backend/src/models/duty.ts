import { v4 as uuidv4 } from 'uuid'
import { InvalidArgumentError } from '../utils/errors'

export class Duty {
  static MAX_NAME_LENGTH = 250

  readonly id: string
  private _name: string

  static create({ name }: { name: string }): Duty {
    return new Duty({ id: uuidv4(), name })
  }

  static createTestInstance({ name = 'Name of Duty' } = {}): Duty {
    return Duty.create({ name })
  }

  constructor({ id, name }: { id: string; name: string }) {
    this.id = id
    this._name = name.trim()
    this.validateName(name)
  }

  private validateName(name: string) {
    if (name.trim().length === 0) {
      throw new InvalidArgumentError('Name of duty cannot be empty')
    }
    if (name.length > Duty.MAX_NAME_LENGTH) {
      throw new InvalidArgumentError(
        `Name of duty cannot be longer than ${Duty.MAX_NAME_LENGTH} characters`,
      )
    }
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    this.validateName(name)
    this._name = name.trim()
  }
}
