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

  it('should complete duty', () => {
    cy.visit('/')
    cy.addDuty({ name: 'Duty 1' })

    cy.findByTestId('complete-button-0').click()

    cy.findByText('Duty 1').should('not.exist')

    cy.visit('/')
    cy.findByText('Duty 1').should('not.exist')
  })
})
