import {
  render,
  screen,
  fireEvent,
  waitFor,
  Screen,
} from '@testing-library/react'
import App from './App'
import { DutyRemoteService, InMemoryDutyService } from './services/duty'

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

  let dutyRemoteService: DutyRemoteService

  beforeEach(() => {
    dutyRemoteService = new InMemoryDutyService()
  })

  it('should display created duties', async () => {
    await dutyRemoteService.createDuty('Sample Duty 1')
    await dutyRemoteService.createDuty('Sample Duty 2')

    render(<App dutyRemoteService={dutyRemoteService} />)
    expect(await screen.findByText('Sample Duty 1')).toBeVisible()
    screen.getByText('Sample Duty 2')
  })

  it('should able to add duty', async () => {
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

  it('should handle error when remote service rejected to create duty', async () => {
    dutyRemoteService.createDuty = () => {
      return Promise.reject(new Error('Create duty failed'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)

    addDutyViaUI(screen)

    expect(await screen.findByText('Create duty failed')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should prevent adding empty duty', async () => {
    render(<App dutyRemoteService={dutyRemoteService} />)

    addDutyViaUI(screen, { name: '' })

    expect(await screen.findByText('Please input the duty.')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should prevent adding duty of very long name', async () => {
    render(<App dutyRemoteService={dutyRemoteService} />)

    addDutyViaUI(screen, { name: 'a'.repeat(101) })

    expect(
      await screen.findByText('Duty name should not exceed 100 characters.'),
    ).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should able to edit duty', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    const editButton = await screen.findByTestId('edit-button-0')
    fireEvent.click(editButton)

    // Edit button should be hidden in edit mode
    await waitFor(() =>
      expect(screen.queryByTestId('edit-button-0')).toBeNull(),
    )

    // Input the new duty name
    const input = screen.getByDisplayValue('Initial Duty')
    fireEvent.change(input, { target: { value: 'Updated Duty' } })

    // Click save button
    const saveButton = screen.getByTestId('save-button-0')
    fireEvent.click(saveButton)

    // Assert UI effects after save
    await screen.findByTestId('edit-button-0')
    expect(screen.queryByTestId('save-button-0')).toBeNull()
    expect(screen.getByText('Updated Duty')).toBeVisible()

    // Assert the duty is updated in remote service
    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(1)
    expect(savedDuties[0].name).toEqual('Updated Duty')
  })

  it('should handle error when remote service rejected to update duty', async () => {
    dutyRemoteService.updateDuty = () => {
      return Promise.reject(new Error('Update duty failed'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)
    addDutyViaUI(screen)

    const editButton = await screen.findByTestId('edit-button-0')
    fireEvent.click(editButton)

    const saveButton = screen.getByTestId('save-button-0')
    fireEvent.click(saveButton)

    expect(await screen.findByText('Update duty failed')).toBeVisible()
  })

  it('should prevent editing existing duty to empty', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    const editButton = await screen.findByTestId('edit-button-0')
    fireEvent.click(editButton)

    const input = screen.getByDisplayValue('Initial Duty')
    fireEvent.change(input, { target: { value: '' } })

    const saveButton = screen.getByTestId('save-button-0')
    fireEvent.click(saveButton)

    expect(await screen.findByText('Cannot edit duty to empty.')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(1)
    expect(savedDuties[0].name).toEqual('Initial Duty')
  })

  it('should prevent editing existing duty to very long name', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    const editButton = await screen.findByTestId('edit-button-0')
    fireEvent.click(editButton)

    const input = screen.getByDisplayValue('Initial Duty')
    fireEvent.change(input, {
      target: { value: 'a'.repeat(101) },
    })

    const saveButton = screen.getByTestId('save-button-0')
    fireEvent.click(saveButton)

    expect(
      await screen.findByText('Duty name should not exceed 100 characters.'),
    ).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(1)
    expect(savedDuties[0].name).toEqual('Initial Duty')
  })

  it('should able to complete duty', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    const completeButton = await screen.findByTestId('complete-button-0')
    fireEvent.click(completeButton)

    await waitFor(() => expect(screen.queryByText('Initial Duty')).toBeNull())

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should handle error when remote service rejected to complete duty', async () => {
    dutyRemoteService.completeDuty = () => {
      return Promise.reject(new Error('Complete duty failed'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)
    addDutyViaUI(screen)

    const completeButton = await screen.findByTestId('complete-button-0')
    fireEvent.click(completeButton)

    expect(await screen.findByText('Complete duty failed')).toBeVisible()
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
