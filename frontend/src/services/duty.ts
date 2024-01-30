import { Duty } from '../models/duty'

export interface DutyRemoteService {
  createDuty: (name: string) => Promise<Duty>
  listDuties(): Promise<Duty[]>
  updateDuty: (duty: Duty) => Promise<unknown>
  completeDuty: (dutyId: string) => Promise<unknown>
}

export class DutyRemoteServiceImpl implements DutyRemoteService {
  private readonly apiEndpoint: string

  constructor({ apiEndpoint }: { apiEndpoint: string }) {
    this.apiEndpoint = apiEndpoint
  }

  async createDuty(name: string) {
    return fetch(`${this.apiEndpoint}/duties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
      return res.json().then((body) => {
        throw new Error(body.message)
      })
    })
  }

  async updateDuty(duty: Duty) {
    return fetch(`${this.apiEndpoint}/duties/${duty.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: duty.name }),
    }).then((res) => {
      if (res.ok) {
        return
      }
      return res.json().then((body) => {
        throw new Error(body.message)
      })
    })
  }

  async listDuties() {
    return fetch(`${this.apiEndpoint}/duties`).then((res) => res.json())
  }

  async completeDuty(dutyId: string) {
    return fetch(`${this.apiEndpoint}/duties/${dutyId}`, {
      method: 'DELETE',
    })
  }
}

export class InMemoryDutyService implements DutyRemoteService {
  private duties: Duty[] = []

  async createDuty(name: string) {
    const duty = { id: `${this.duties.length}`, name }
    this.duties.push(duty)
    return duty
  }

  async listDuties() {
    return this.duties
  }

  async updateDuty(duty: Duty) {
    const index = this.duties.findIndex((d) => d.id === duty.id)
    if (index === -1) {
      throw new Error('Duty not found')
    }
    this.duties[index] = duty
  }

  async completeDuty(dutyId: string) {
    this.duties = this.duties.filter((d) => d.id !== dutyId)
  }
}
