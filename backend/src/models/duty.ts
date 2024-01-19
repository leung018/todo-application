export interface Duty {
  id: string
  name: string
}

export class DutyFactory {
  static createDuty({ name }: { name: string }): Duty {
    return {
      id: '', // TODO: generate uuid
      name,
    }
  }
}
