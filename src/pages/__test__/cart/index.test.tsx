import Cart from '@/pages/cart'
import { render } from '@/test/testUtils'

import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'

describe('Cart Page', () => {
  it('renders cart page', () => {
    render(<Cart />)
    expect(screen.getByText('Cart')).toBeInTheDocument()
  })
})
