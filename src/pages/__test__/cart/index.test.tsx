import Cart from '@/pages/cart'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Cart Page', () => {
  it('renders cart page', () => {
    render(<Cart />)
    expect(screen.getByText('Cart')).toBeInTheDocument()
  })
})
