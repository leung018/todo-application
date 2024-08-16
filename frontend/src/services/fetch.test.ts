import { myFetch } from './fetch'
import http from 'http'

const HOST = 'localhost'
const PORT = 5001
const URL = `http://${HOST}:${PORT}`

describe('myFetch', () => {
  let server: TestServer

  beforeAll(() => {
    server = new TestServer()
    server.start()
  })

  afterAll(() => {
    server.stop()
  })

  it('should throw error if network of server cannot be reached', async () => {
    const url = 'http://localhost:3000/unknown'
    await expect(myFetch(url)).rejects.toThrow('Unable to interact with server')
  })

  it('should throw error if response status is not ok', async () => {
    server.setNextResponse({
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Internal Server Error',
    })
    await expect(myFetch(URL)).rejects.toThrow('Unexpected error')
  })
})

interface MyResponse {
  status: number
  headers: Record<string, string>
  body: string
}

class TestServer {
  private server: http.Server = http.createServer((req, res) => {
    this.handleRequest(req, res)
  })
  private nextResponse: MyResponse = {
    status: 500,
    headers: {},
    body: 'response not specified',
  }

  reset() {
    this.nextResponse = {
      status: 500,
      headers: {},
      body: 'response not specified',
    }
  }

  start() {
    this.server.listen(PORT)
  }

  stop() {
    this.server.close()
  }

  setNextResponse(response: MyResponse) {
    this.nextResponse = response
  }

  private handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ) {
    response.statusCode = this.nextResponse.status
    Object.entries(this.nextResponse.headers).forEach(([key, value]) => {
      response.setHeader(key, value)
    })
    response.end(this.nextResponse.body)
  }
}
