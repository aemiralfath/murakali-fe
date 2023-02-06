import Checkout from '@/pages/checkout'

import '@testing-library/jest-dom'
import mockRouter from 'next-router-mock'

import { mockUseMediaQuery } from '../mock/hooks'
import { renderWithProviders, screen } from '../testUtils'

jest.mock('next/router', () => require('next-router-mock'))

const testValue =
  'U2FsdGVkX18oBCY9U5CxuclgopLoSrXy%2BURpt7qby5Kh8rw3IJSzwdDpHHEndNbOuCwgmeB1BHwhhtCv8f6YHzDDUKTdJLboojQX1GsjcBxUfCQCf8Mvmz7qIpWS0ZY6upaVgdir%2B%2ByyYIcmjmEMrq7p7IO4aYHRIpzyKYpdQxyRJMIaAv7z66TJnR2q1SHVNVGtVvuj3aFNJqbsg0HyBnvmvkM8yPtKcPNyPiqgtT0b4U4XuCzAAf9rug2vx5Xs'

describe('Checkout Page', () => {
  beforeAll(() => {
    mockUseMediaQuery.mockReturnValue(true)

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('renders checkout page', () => {
    renderWithProviders(<Checkout />)
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })

  it('renders product and shop', () => {
    renderWithProviders(<Checkout />)

    mockRouter.push('/checkout?values=' + testValue)
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })
})
