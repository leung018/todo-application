import {
  render,
  screen,
  fireEvent,
  waitFor,
  Screen,
} from '@testing-library/react'
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
    expect(await screen.findByText('Sample Duty 1')).toBeVisible()
    screen.getByText('Sample Duty 2')
  })

  it('should create new duty', async () => {
    const dutyRemoteService = new InMemoryDutyService()
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)
    // If not wait for this and add new duty directly, the test can't cover the behavior of displaying new duty
    // because the useEffect hook may be triggered after the add button is clicked.
    await screen.findByText('Initial Duty')

    addDutyViaUI(screen, { name: 'New Duty' })

    // Input should be cleared
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add new duty')).toHaveValue('')
    })

    // New Duty should be displayed
    expect(await screen.findByText('New Duty')).toBeVisible()

    // New Duty should be saved
    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(2)
    expect(savedDuties[1].name).toEqual('New Duty')
  })

  it('should handle error when remote service promise rejected', async () => {
    const dutyRemoteService = new InMemoryDutyService()
    dutyRemoteService.createDuty = () => {
      return Promise.reject(new Error('Create duty failed'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)

    addDutyViaUI(screen)

    expect(await screen.findByText('Create duty failed')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  function addDutyViaUI(
    screen: Screen,
    { name = 'Duty 1' }: { name?: string } = {},
  ) {
    const input = screen.getByPlaceholderText('Add new duty')
    fireEvent.change(input, { target: { value: name } })

    const addButton = screen.getByText('Add')
    fireEvent.click(addButton)
  }
})
