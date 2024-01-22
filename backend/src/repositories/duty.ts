import { Duty } from '../models/duty'

export interface DutyRepository {
  create(duty: Duty): Promise<void>

  /**
   * @returns the list of duties in the order they were created
   *
   * It may make more sense if the sorting preference can be chosen by the user instead of specifying this fact in comments of interface.
   * But for the size of this application, it is fine.
   */
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
