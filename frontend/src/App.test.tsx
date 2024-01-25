import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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

  it('should create new duty', async () => {
    const dutyRemoteService = new InMemoryDutyService()
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)
    // If not wait for this and add new duty directly, the test can't cover the behavior of displaying new duty
    // because the useEffect hook may be triggered after the add button is clicked.
    await waitFor(() => screen.findByText('Initial Duty'))

    const input = screen.getByPlaceholderText('Add new duty')
    fireEvent.change(input, { target: { value: 'New Duty' } })

    const addButton = screen.getByText('Add')
    fireEvent.click(addButton)

    // Input should be cleared
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add new duty')).toHaveValue('')
    })

    // New Duty should be displayed
    await waitFor(() => screen.findByText('New Duty'))

    // New Duty should be saved
    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(2)
    expect(savedDuties[1].name).toEqual('New Duty')
  })
})
