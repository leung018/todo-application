import { describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import { ExpressAppInitializer } from './app'
import { Express } from 'express'
import { RouteService } from './route/route'

describe('API', () => {
  let app: Express

  beforeEach(() => {
    app = ExpressAppInitializer.createNull().app
  })

  it('should handle uncaught promise exception from routeService', async () => {
    // Add route service that throws error
    const expressAppInitializer = ExpressAppInitializer.createNull()
    const errorRouteService = new (class extends RouteService {
      constructor() {
        super()
        this.get('/', async () => {
          throw new Error('Unexpected error')
        })
      }
    })()
    expressAppInitializer.addRouteService('/error', errorRouteService)
    app = expressAppInitializer.app

    // Make request to that route
    const response = await request(app).get('/error')

    expect(response.status).toBe(500)
  })

  it('should return back duty tend to create', async () => {
    const duty = await createDuty({ name: 'My Duty' })
    expect(duty.name).toBe('My Duty')
    expect(typeof duty.id).toBe('string')
  })

  it('should return bad request if invalid duty name', async () => {
    const response = await callCreateDutyApi({ name: '' })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Name of duty cannot be empty')
  })

  it('should create single duty and list it', async () => {
    const createdDuty = await createDuty({ name: 'My Duty' })

    const listedDuties = await listDuties()
    expect(listedDuties.length).toBe(1)
    expect(listedDuties[0]).toEqual(createdDuty)
  })

  it('should create multiple duties and list them', async () => {
    await createDuty({ name: 'Duty 1' })
    await createDuty({ name: 'Duty 2' })
    await createDuty({ name: 'Duty 3' })

    const duties = await listDuties()
    expect(duties.length).toBe(3)
    expect(duties[0].name).toBe('Duty 1')
    expect(duties[1].name).toBe('Duty 2')
    expect(duties[2].name).toBe('Duty 3')
  })

  async function createDuty({ name = 'Name of Duty' } = {}) {
    const response = await callCreateDutyApi({ name })
    expect(response.status).toBe(201)
    return response.body
  }

  async function callCreateDutyApi({ name }: { name: string }) {
    return request(app).post('/duties').send({ name })
  }

  async function listDuties() {
    const response = await callListDutiesApi()
    expect(response.status).toBe(200)
    return response.body
  }

  async function callListDutiesApi() {
    return request(app).get('/duties')
  }
})
