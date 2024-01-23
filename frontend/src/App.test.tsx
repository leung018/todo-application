import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('dummy test', () => {
    // Just check the jest is working. This test will be removed.
    render(<App />)
    const element = screen.getByText('Duties List')
    expect(element).toBeInTheDocument()
  })
})
