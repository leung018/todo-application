import { describe, it, expect, beforeAll } from '@jest/globals'
import express, { Express } from 'express'
import request from 'supertest'
import { createRouter } from './route'

describe('createRouter', () => {
  describe('should handle uncaught promise exception from handler', () => {
    let app: Express

    beforeAll(() => {
      const asyncHandlerThrowError = async () => {
        throw new Error('Unexpected error')
      }
      const router = createRouter([
        {
          path: '/',
          method: 'get',
          handler: asyncHandlerThrowError,
        },
        {
          path: '/',
          method: 'post',
          handler: asyncHandlerThrowError,
        },
        {
          path: '/',
          method: 'put',
          handler: asyncHandlerThrowError,
        },
        {
          path: '/',
          method: 'delete',
          handler: asyncHandlerThrowError,
        },
        {
          path: '/',
          method: 'patch',
          handler: asyncHandlerThrowError,
        },
      ])

      app = express()
      app.use('/error', router)
    })

    it('get', async () => {
      const response = await request(app).get('/error')
      expect(response.status).toBe(500)
    })

    it('post', async () => {
      const response = await request(app).post('/error')
      expect(response.status).toBe(500)
    })

    it('put', async () => {
      const response = await request(app).put('/error')
      expect(response.status).toBe(500)
    })

    it('delete', async () => {
      const response = await request(app).delete('/error')
      expect(response.status).toBe(500)
    })

    it('patch', async () => {
      const response = await request(app).patch('/error')
      expect(response.status).toBe(500)
    })
  })
})
