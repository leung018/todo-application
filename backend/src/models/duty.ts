import { v4 as uuidv4 } from 'uuid'
import { InvalidArgumentError } from '../utils/errors'

export interface Duty {
  readonly id: string
  name: string
}

export class DutyFactory {
  static createDuty({ name }: { name: string }): Duty {
    if (name.trim().length === 0) {
      throw new InvalidArgumentError('Name of duty cannot be empty')
    }

    return {
      id: uuidv4(),
      name,
    }
  }
}
