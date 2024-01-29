describe('e2e tests', () => {
  beforeEach(() => {
    cy.request('DELETE', `${Cypress.env('backendUrl')}/duties`)
  })

  it('should create duty successfully', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Add new duty').type('Duty 1')
    cy.findByText('Add').click()

    cy.findByText('Duty 1').should('exist')

    cy.visit('/')
    cy.findByText('Duty 1').should('exist')
  })

  it('should display error message when creating empty duty', () => {
    cy.visit('/')

    cy.findByText('Add').click()

    cy.findByText('Name of duty cannot be empty').should('exist')
  })

  it('should update created duty', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Add new duty').type('Duty 1')
    cy.findByText('Add').click()

    cy.findByTestId('edit-button-0').click()
    cy.findByDisplayValue('Duty 1').type(' Updated')
    cy.findByTestId('save-button-0').click()

    cy.findByText('Duty 1 Updated').should('exist')

    cy.visit('/')
    cy.findByText('Duty 1 Updated').should('exist')
  })

  it('should display error message when updating duty to empty', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Add new duty').type('Duty 1')
    cy.findByText('Add').click()

    cy.findByTestId('edit-button-0').click()
    cy.findByDisplayValue('Duty 1').clear()
    cy.findByTestId('save-button-0').click()

    cy.findByText('Name of duty cannot be empty').should('exist')
  })
})
