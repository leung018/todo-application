import { describe, it, expect } from '@jest/globals'
import request from 'supertest'
import { ExpressAppInitializer } from './app'

describe('ExpressApp', () => {
  it('should create single duty and list it', async () => {
    const app = ExpressAppInitializer.createNull().app
    const response = await request(app)
      .post('/duties')
      .send({ name: 'My Duty' })
    expect(response.status).toBe(201)

    const response2 = await request(app).get('/duties')
    expect(response2.status).toBe(200)

    const duties = response2.body
    expect(duties.length).toBe(1)
    expect(duties[0].name).toBe('My Duty')
    expect(typeof duties[0].id).toBe('string')
  })
})
