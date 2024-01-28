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
})
