import { expect } from '@jest/globals'
import { Response } from 'supertest'

export function assertErrorResponse(
  expected: {
    status: number
    message: string
  },
  actualResponse: Response,
) {
  expect(actualResponse.status).toBe(expected.status)
  expect(actualResponse.body.message).toBe(expected.message)
}
