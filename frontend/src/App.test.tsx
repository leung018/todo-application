import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { InMemoryDutyService } from './services/duty'

describe('App', () => {
  beforeAll(() => {
    // Ref: https://github.com/ant-design/ant-design/issues/21096#issuecomment-732368647
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        }
      },
    })
  })

  it('should display created duties', async () => {
    const dutyRemoteService = new InMemoryDutyService()
    await dutyRemoteService.createDuty('Sample Duty 1')
    await dutyRemoteService.createDuty('Sample Duty 2')

    render(<App dutyRemoteService={dutyRemoteService} />)
    await waitFor(() => screen.findByText('Sample Duty 1'))
    screen.getByText('Sample Duty 2')
  })
})
