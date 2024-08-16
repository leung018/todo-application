/* Using myFetch instead of fetch, we can return the JSON response directly, and reject all response with non-200 status code as an error.
 * This can simplify the error handling in the frontend code and let the interface of the remote service can specify the return type of promise as the expected JSON response directly.
 */
export async function myFetch(url: string, init?: RequestInit) {
  return fetch(url, init)
    .then((res) => {
      if (!res.ok) {
        // TODO: Currently frontend already guards the case for bad request. If future display error message is needed, we can add more specific error handling here.
        throw new RequestFailedError('Unexpected error')
      }
      const contentType = res.headers.get('Content-Type')
      if (contentType && contentType.includes('application/json')) {
        return res.json()
      }
    })
    .catch((err) => {
      if (err instanceof RequestFailedError) {
        throw err
      }
      console.error(err)
      throw new Error('Unable to interact with server')
    })
}

class RequestFailedError extends Error {}
