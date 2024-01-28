import { v4 as uuidv4 } from 'uuid'
import { InvalidArgumentError } from '../utils/errors'

export interface Duty {
  readonly id: string
  name: string
}

export class DutyFactory {
  static MAX_NAME_LENGTH = 250

  static createDuty({ name }: { name: string }): Duty {
    if (name.trim().length === 0) {
      throw new InvalidArgumentError('Name of duty cannot be empty')
    }
    if (name.length > this.MAX_NAME_LENGTH) {
      throw new InvalidArgumentError(
        `Name of duty cannot be longer than ${this.MAX_NAME_LENGTH} characters`,
      )
    }

    return {
      id: uuidv4(),
      name,
    }
  }
}
