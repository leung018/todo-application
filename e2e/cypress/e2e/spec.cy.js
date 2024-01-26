describe('e2e tests', () => {
  it('should create duty successfully', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Add new duty').type('Duty 1')
    cy.findByText('Add').click()

    cy.findByText('Duty 1').should('exist')

    cy.visit('/')
    cy.findByText('Duty 1').should('exist')
  })
})
