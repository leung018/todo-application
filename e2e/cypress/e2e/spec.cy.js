describe('e2e tests', () => {
  beforeEach(() => {
    cy.request('DELETE', `${Cypress.env('backendUrl')}/duties`)
  })

  it('should create duty successfully', () => {
    cy.visit('/')

    cy.addDuty({ name: 'Duty 1' })

    cy.findByText('Duty 1').should('exist')

    cy.visit('/')
    cy.findByText('Duty 1').should('exist')
  })

  it('should display error message when creating empty duty', () => {
    cy.visit('/')

    cy.findByText('Add').click()

    cy.findByText(EMPTY_DUTY_ERROR_MESSAGE).should('exist')
  })

  it('should update created duty', () => {
    cy.visit('/')

    cy.addDuty({ name: 'Duty 1' })

    cy.findByTestId('edit-button-0').click()
    cy.findByDisplayValue('Duty 1').type(' Updated')
    cy.findByTestId('save-button-0').click()

    cy.findByText('Duty 1 Updated').should('exist')

    cy.visit('/')
    cy.findByText('Duty 1 Updated').should('exist')
  })

  it('should display error message when updating duty to empty', () => {
    cy.visit('/')

    cy.addDuty({ name: 'Duty 1' })

    cy.findByTestId('edit-button-0').click()
    cy.findByDisplayValue('Duty 1').clear()
    cy.findByTestId('save-button-0').click()

    cy.findByText(EMPTY_DUTY_ERROR_MESSAGE).should('exist')
  })
})

const EMPTY_DUTY_ERROR_MESSAGE = 'Name of duty cannot be empty'
