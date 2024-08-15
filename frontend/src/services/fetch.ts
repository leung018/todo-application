export function myFetch(url: string, init?: RequestInit) {
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
