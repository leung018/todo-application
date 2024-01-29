import { Duty } from '../models/duty'
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EntityNotFoundError } from '../utils/errors'
import { PostgresContext, newPostgresClient } from './util'
import postgres from 'postgres'

export interface DutyRepository {
  create(duty: Duty): Promise<void>

  /**
   * Retrieves a list of duties in the order they were added.
   */
  listDuties(): Promise<Duty[]>
  // Remark: It may make more sense if the sorting preference can be chosen by the user instead of specifying this fact in comments of interface.
  // But for the size of this application, it is fine.

  deleteAllDuties(): Promise<void>

  /**
   * @throws {EntityNotFoundError} if duty with given id does not exist
   */
  update(duty: Duty): Promise<void>
}

export class InMemoryDutyRepository implements DutyRepository {
  private duties: Duty[] = []

  async create(duty: Duty) {
    this.duties.push(duty)
  }

  async listDuties() {
    return this.duties
  }

  async deleteAllDuties() {
    this.duties = []
  }

  async update(duty: Duty) {
    const index = this.duties.findIndex((d) => d.id === duty.id)
    if (index === -1) {
      throw new EntityNotFoundError('Duty not found')
    }
    this.duties[index] = duty
  }
}

export class PostgresDutyRepository implements DutyRepository {
  readonly sql // TODO: make this private

  static async create(context: PostgresContext) {
    const repo = new PostgresDutyRepository(context)
    await repo.createTableIfNotExists()
    return repo
  }

  private constructor(context: PostgresContext) {
    this.sql = newPostgresClient(context)
  }

  private async createTableIfNotExists() {
    await this.sql`
      CREATE TABLE IF NOT EXISTS duties (
        id UUID PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
  }

  async create(duty: Duty) {
    await this.sql`
      INSERT INTO duties ${this.sql(duty, 'id', 'name')}`
  }

  async update(duty: Duty): Promise<void> {
    const rows = await this.sql`
      UPDATE duties
      SET name = ${duty.name}
      WHERE id = ${duty.id}
      RETURNING *
    `
    if (rows.length === 0) {
      throw new EntityNotFoundError('Duty not found')
    }
  }

  async listDuties() {
    const rows = await this.sql`
      SELECT * FROM duties
      ORDER BY created_at ASC
    `
    return rows.map(this.mapRowToDuty)
  }

  async deleteAllDuties() {
    await this.sql`DELETE FROM duties`
  }

  private mapRowToDuty(row: postgres.Row): Duty {
    return new Duty({
      id: row.id,
      name: row.name,
    })
  }

  close() {
    return this.sql.end()
  }
}
