import { v4 as uuidv4 } from 'uuid'

export interface Duty {
  id: string
  name: string
}

export class DutyFactory {
  static createDuty({ name }: { name: string }): Duty {
    return {
      id: uuidv4(),
      name,
    }
  }
}
