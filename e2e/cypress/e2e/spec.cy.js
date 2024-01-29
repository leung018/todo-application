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
})
