import {
  render,
  screen,
  fireEvent,
  waitFor,
  Screen,
} from '@testing-library/react'
import App from './App'
import { DutyRemoteService, InMemoryDutyRemoteService } from './services/duty'
import { DUTY_MAX_NAME_LENGTH } from './models/duty'

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
    dutyRemoteService = new InMemoryDutyRemoteService()
  })

  it('should display created duties', async () => {
    await dutyRemoteService.createDuty('Sample Duty 1')
    await dutyRemoteService.createDuty('Sample Duty 2')

    render(<App dutyRemoteService={dutyRemoteService} />)
    expect(await screen.findByText('Sample Duty 1')).toBeVisible()
    screen.getByText('Sample Duty 2')
  })

  it('should handle error when remote service rejected to list duties', async () => {
    dutyRemoteService.listDuties = () => {
      return Promise.reject(new Error('Failed to list duties'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)

    expect(await screen.findByText('Failed to list duties')).toBeVisible()
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

    addDutyViaUI(screen, { name: '   ' })

    expect(await screen.findByText('Please input the duty.')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should prevent adding duty of very long name', async () => {
    render(<App dutyRemoteService={dutyRemoteService} />)

    addDutyViaUI(screen, { name: 'a'.repeat(DUTY_MAX_NAME_LENGTH + 1) })

    expect(
      await screen.findByText(
        `Duty name should not exceed ${DUTY_MAX_NAME_LENGTH} characters.`,
      ),
    ).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(0)
  })

  it('should able to edit duty', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    await editDutyViaUI(screen, {
      itemIndex: 0,
      originalName: 'Initial Duty',
      newName: 'Updated Duty',
    })

    expect(screen.getByText('Updated Duty')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(1)
    expect(savedDuties[0].name).toEqual('Updated Duty')
  })

  it('should handle error when remote service rejected to update duty', async () => {
    dutyRemoteService.updateDuty = () => {
      return Promise.reject(new Error('Update duty failed'))
    }

    render(<App dutyRemoteService={dutyRemoteService} />)
    addDutyViaUI(screen, { name: 'Duty' })

    await editDutyViaUI(screen, {
      itemIndex: 0,
      originalName: 'Duty',
    })

    expect(await screen.findByText('Update duty failed')).toBeVisible()
  })

  it('should prevent editing existing duty to empty', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    await editDutyViaUI(screen, {
      itemIndex: 0,
      originalName: 'Initial Duty',
      newName: '    ',
    })

    expect(await screen.findByText('Cannot edit duty to empty.')).toBeVisible()

    const savedDuties = await dutyRemoteService.listDuties()
    expect(savedDuties).toHaveLength(1)
    expect(savedDuties[0].name).toEqual('Initial Duty')
  })

  it('should prevent editing existing duty to very long name', async () => {
    await dutyRemoteService.createDuty('Initial Duty')

    render(<App dutyRemoteService={dutyRemoteService} />)

    await editDutyViaUI(screen, {
      itemIndex: 0,
      originalName: 'Initial Duty',
      newName: 'a'.repeat(DUTY_MAX_NAME_LENGTH + 1),
    })

    expect(
      await screen.findByText(
        `Duty name should not exceed ${DUTY_MAX_NAME_LENGTH} characters.`,
      ),
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

  async function editDutyViaUI(
    screen: Screen,
    {
      itemIndex,
      originalName,
      newName = 'Updated Duty',
    }: { itemIndex: number; originalName: string; newName?: string },
  ) {
    const editButton = await screen.findByTestId(`edit-button-${itemIndex}`)
    fireEvent.click(editButton)

    // Edit button should be hidden in edit mode
    await waitFor(() =>
      expect(screen.queryByTestId(`edit-button-${itemIndex}`)).toBeNull(),
    )

    // Input the new duty name
    const input = screen.getByDisplayValue(originalName)
    fireEvent.change(input, { target: { value: newName } })

    // Click save button
    const saveButton = screen.getByTestId(`save-button-${itemIndex}`)
    fireEvent.click(saveButton)

    // Save button should be hidden after save while edit button should be visible
    await screen.findByTestId(`edit-button-${itemIndex}`)
    expect(screen.queryByTestId(`save-button-${itemIndex}`)).toBeNull()
  }
})
