import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Cart from './index'

describe('Cart Page', () => {
  it('Render Cart Page', () => {
    render(<Cart />)
    expect(screen.getByText('Cart')).toBeInTheDocument()
  })
})
