import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'
import request from 'supertest'
import { describe, it, expect } from '@jest/globals'
import { createRouter } from './route'
import { RouteErrorHandler } from './util'
import { assertErrorResponse } from '../test_utils/assert'

describe('RouteErrorHandler', () => {
  class CustomError extends Error {}
  class UnexpectedError extends Error {}

  function newExpressApp(
    handlerOfRootGetRoute: (
      req: ExpressRequest,
      res: ExpressResponse,
    ) => Promise<void>,
  ) {
    const app = express()
    const router = createRouter([
      { path: '/', method: 'get', handler: handlerOfRootGetRoute },
    ])
    app.use(router)
    return app
  }

  it('should return 500 for unexpected error', async () => {
    const app = newExpressApp(async (req, res) => {
      try {
        throw new UnexpectedError('Unexpected error')
      } catch (err) {
        return new RouteErrorHandler([
          {
            statusCode: 401,
            typeOfError: CustomError,
          },
        ]).handle(err, res)
      }
    })
    const response = await request(app).get('/')
    expect(response.status).toBe(500)
  })

  it('should return templated response for expected error', async () => {
    const app = newExpressApp(async (req, res) => {
      try {
        throw new CustomError('Default message')
      } catch (err) {
        return new RouteErrorHandler([
          {
            statusCode: 403,
            typeOfError: CustomError,
          },
        ]).handle(err, res)
      }
    })
    const response = await request(app).get('/')
    assertErrorResponse(
      {
        status: 403,
        message: 'Default message',
      },
      response,
    )
  })

  it('should custom response contain custom message if template provided it', async () => {
    const app = newExpressApp(async (req, res) => {
      try {
        throw new CustomError('Default message')
      } catch (err) {
        return new RouteErrorHandler([
          {
            statusCode: 402,
            typeOfError: CustomError,
            customMessage: 'Custom message',
          },
        ]).handle(err, res)
      }
    })
    const response = await request(app).get('/')
    assertErrorResponse(
      {
        status: 402,
        message: 'Custom message',
      },
      response,
    )
  })
})
