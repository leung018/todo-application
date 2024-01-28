import { Duty } from '../models/duty'

export interface DutyRemoteService {
  createDuty: (name: string) => Promise<Duty>
  listDuties(): Promise<Duty[]>
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
      } else {
        // TODO: test it in e2e test
        return res.json().then((body) => {
          throw new Error(body.message)
        })
      }
    })
  }

  async listDuties() {
    return fetch(`${this.apiEndpoint}/duties`).then((res) => res.json())
  }
}

export class InMemoryDutyService implements DutyRemoteService {
  private readonly duties: Duty[] = []

  async createDuty(name: string) {
    const duty = { id: 'dummy', name } // TODO: Replace dummy id with sth dynamic
    this.duties.push(duty)
    return duty
  }

  async listDuties() {
    return this.duties
  }
}
