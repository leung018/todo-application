import { Duty } from '../models/duty'

export interface DutyRemoteService {
  createDuty: (name: string) => Promise<Duty>
  listDuties(): Promise<Duty[]>
  updateDuty: (duty: Duty) => Promise<void>
  completeDuty: (dutyId: string) => Promise<void>
}

function myFetch(url: string, init?: RequestInit) {
  return fetch(url, init)
    .then((res) => {
      if (!res.ok) {
        // TODO: Currently frontend already guards the case for bad request. If future display error message is needed, we can add more specific error handling here.
        throw new Error('Unexpected error')
      }
      const contentType = res.headers.get('Content-Type')
      if (contentType && contentType.includes('application/json')) {
        return res.json()
      }
    })
    .catch(() => {
      throw new Error('Unable to interact with server')
    })
}

export class DutyRemoteServiceImpl implements DutyRemoteService {
  private readonly apiEndpoint: string

  constructor({ apiEndpoint }: { apiEndpoint: string }) {
    this.apiEndpoint = apiEndpoint
  }

  async createDuty(name: string) {
    return myFetch(`${this.apiEndpoint}/duties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
  }

  async updateDuty(duty: Duty) {
    return myFetch(`${this.apiEndpoint}/duties/${duty.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: duty.name }),
    })
  }

  async listDuties() {
    return myFetch(`${this.apiEndpoint}/duties`)
  }

  async completeDuty(dutyId: string) {
    return myFetch(`${this.apiEndpoint}/duties/${dutyId}`, {
      method: 'DELETE',
    })
  }
}

export class InMemoryDutyRemoteService implements DutyRemoteService {
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
