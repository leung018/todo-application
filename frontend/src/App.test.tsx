import { render, screen } from '@testing-library/react'
import App from './App'

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

  it('dummy test', () => {
    // Just check the jest is working. This test will be removed.
    render(<App />)
    const element = screen.getByText('Duties List')
    expect(element).toBeInTheDocument()
  })
})
