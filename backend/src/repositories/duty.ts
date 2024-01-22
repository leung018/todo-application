import { Duty } from '../models/duty'

export interface DutyRepository {
  create(duty: Duty): Promise<void>
  listDuties(): Promise<Duty[]>
}

export class InMemoryDutyRepository implements DutyRepository {
  private duties: Duty[] = []

  async create(duty: Duty) {
    this.duties.push(duty)
  }

  async listDuties() {
    return this.duties
  }
}
