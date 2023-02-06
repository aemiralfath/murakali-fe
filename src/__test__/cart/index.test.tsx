/* eslint-disable @typescript-eslint/no-empty-function */
import { authorizedClient } from '@/api/apiClient'
import { env } from '@/env/client.mjs'
import Cart from '@/pages/cart'
import type { CheckoutValues } from '@/pages/checkout'

import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import CryptoJS from 'crypto-js'
import mockRouter from 'next-router-mock'

import { mockUseMediaQuery } from '../mock/hooks'
import { renderWithProviders, userEvent } from '../testUtils'

jest.mock('next/router', () => require('next-router-mock'))

const mockAuthorizedClient = new MockAdapter(authorizedClient)
const secret = env.NEXT_PUBLIC_SECRET_KEY

const getCartHoverHomeDummy = {
  message: 'success',
  data: {
    limit: 5,
    total_item: 4,
    cart_items: [
      {
        title:
          'Mainan Jadul Viral Tek Tek Etek Etek Mainan Lato Lato Latto Katto',
        thumbnail_url:
          'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/12/11/bf665086-aa44-4d15-a2a6-926231788f60.jpg',
        price: 3000,
        discount_percentage: null,
        discount_fix_price: null,
        min_product_price: null,
        max_discount_price: null,
        quota: null,
        result_discount: 0,
        sub_price: 0,
        quantity: 1,
        variant: {
          warna: 'hitam',
        },
      },
      {
        title:
          'Changhong Google certified Android Smart TV 32 inch 32H4 LED TV-L32H4',
        thumbnail_url:
          'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/1/17/5557717b-dc4e-4349-8cc2-c5ec7e54b528.jpg',
        price: 1949000,
        discount_percentage: null,
        discount_fix_price: null,
        min_product_price: null,
        max_discount_price: null,
        quota: null,
        result_discount: 0,
        sub_price: 0,
        quantity: 1,
        variant: {
          warna: 'hitam',
        },
      },
      {
        title: 'YONEX ASTROX 99 PRO RAKET BADMINTON ORIGINAL',
        thumbnail_url:
          'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/8/12/64c21fd7-4bce-4f37-a015-e26a943f79d2.jpg',
        price: 2299000,
        discount_percentage: null,
        discount_fix_price: null,
        min_product_price: null,
        max_discount_price: null,
        quota: null,
        result_discount: 0,
        sub_price: 0,
        quantity: 1,
        variant: {
          warna: 'hitam',
        },
      },
      {
        title: 'Helm Kyt Djmaru DJ Maru Solid/Polos Black Doff',
        thumbnail_url:
          'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/10/29/a6261046-9836-4387-b788-d2abdddd7329.jpg',
        price: 285000,
        discount_percentage: null,
        discount_fix_price: null,
        min_product_price: null,
        max_discount_price: null,
        quota: null,
        result_discount: 0,
        sub_price: 0,
        quantity: 1,
        variant: {
          warna: 'hitam',
        },
      },
    ],
  },
}

const getCartItems = {
  message: 'success',
  data: {
    limit: 4,
    page: 1,
    sort: 'created_at DESC',
    total_rows: 4,
    total_pages: 1,
    rows: [
      {
        id: '48ce58e7-4cd9-43f3-9d82-93d4cfd582c2',
        shop: {
          id: 'a050cfb3-957c-4b35-83cb-ff65095c6eb5',
          name: 'Hobi & Koleksi Shop',
        },
        weight: 800,
        product_details: [
          {
            id: '6bc58599-53d4-456a-91cf-6b6809d36e87',
            title:
              'Mainan Jadul Viral Tek Tek Etek Etek Mainan Lato Lato Latto Katto',
            thumbnail_url:
              'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/12/11/bf665086-aa44-4d15-a2a6-926231788f60.jpg',
            product_price: 3000,
            product_stock: 31,
            quantity: 1,
            weight: 800,
            variant: {
              warna: 'hitam',
            },
            promo: {
              discount_percentage: null,
              discount_fix_price: null,
              min_product_price: null,
              max_discount_price: null,
              result_discount: 0,
              sub_price: 0,
              quota: null,
            },
          },
        ],
      },
      {
        id: 'f7e00353-4ed1-4f07-8e3c-456efce4ed41',
        shop: {
          id: 'e8854443-c2c7-488e-93d5-b9d93708b8a3',
          name: 'Elektronik Shop 2',
        },
        weight: 800,
        product_details: [
          {
            id: 'a1685400-784d-4f6a-899b-ec0c156ac9cf',
            title:
              'Changhong Google certified Android Smart TV 32 inch 32H4 LED TV-L32H4',
            thumbnail_url:
              'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/1/17/5557717b-dc4e-4349-8cc2-c5ec7e54b528.jpg',
            product_price: 1949000,
            product_stock: 47,
            quantity: 1,
            weight: 800,
            variant: {
              warna: 'hitam',
            },
            promo: {
              discount_percentage: null,
              discount_fix_price: null,
              min_product_price: null,
              max_discount_price: null,
              result_discount: 0,
              sub_price: 0,
              quota: null,
            },
          },
        ],
      },
      {
        id: '111597af-1e5b-4162-b139-5185d51ccf03',
        shop: {
          id: 'd2fd9f2b-e4f1-4ac2-a0b8-57e189d73a33',
          name: 'Raket Shop',
        },
        weight: 800,
        product_details: [
          {
            id: 'f8326496-a658-476a-b06f-ff927d390f49',
            title: 'YONEX ASTROX 99 PRO RAKET BADMINTON ORIGINAL',
            thumbnail_url:
              'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/8/12/64c21fd7-4bce-4f37-a015-e26a943f79d2.jpg',
            product_price: 2299000,
            product_stock: 15,
            quantity: 1,
            weight: 800,
            variant: {
              warna: 'hitam',
            },
            promo: {
              discount_percentage: null,
              discount_fix_price: null,
              min_product_price: null,
              max_discount_price: null,
              result_discount: 0,
              sub_price: 0,
              quota: null,
            },
          },
        ],
      },
      {
        id: '14f949e4-267e-49d3-98a1-1485b870b5fa',
        shop: {
          id: '4b0feacd-6654-4f83-83b0-b8b6b5314713',
          name: 'Helm Shop',
        },
        weight: 900,
        product_details: [
          {
            id: '1604d615-fc7f-4077-9657-5d0e90ff43b7',
            title: 'Helm Kyt Djmaru DJ Maru Solid/Polos Black Doff',
            thumbnail_url:
              'https://images.tokopedia.net/img/cache/200-square/VqbcmM/2022/10/29/a6261046-9836-4387-b788-d2abdddd7329.jpg',
            product_price: 285000,
            product_stock: 34,
            quantity: 1,
            weight: 900,
            variant: {
              warna: 'hitam',
            },
            promo: {
              discount_percentage: null,
              discount_fix_price: null,
              min_product_price: null,
              max_discount_price: null,
              result_discount: 0,
              sub_price: 0,
              quota: null,
            },
          },
        ],
      },
    ],
  },
}

describe('Cart Page', () => {
  beforeAll(() => {
    mockAuthorizedClient
      .onGet('/cart/hover-home?limit=5')
      .reply(200, getCartHoverHomeDummy)
    mockAuthorizedClient.onGet('/cart/items').reply(200, getCartItems)
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

  it('renders cart page', () => {
    renderWithProviders(<Cart />)

    expect(screen.getByText('Cart')).toBeInTheDocument()

    const chooseAllCheckbox = screen.getByTestId('choose-all-checkbox')
    expect(chooseAllCheckbox).toBeInTheDocument()
  })

  it('can select and deselect all items', async () => {
    renderWithProviders(<Cart />)

    const chooseAllCheckbox = screen.getByTestId('choose-all-checkbox')
    const buyButton = screen.getByTestId('button-buy') as HTMLButtonElement

    expect(chooseAllCheckbox).toBeInTheDocument()
    expect(buyButton).toBeDisabled()
    await userEvent.click(chooseAllCheckbox)

    const shopCheckbox1 = screen.getByTestId(
      'checkbox-a050cfb3-957c-4b35-83cb-ff65095c6eb5'
    ) as HTMLInputElement
    const shopCheckbox2 = screen.getByTestId(
      'checkbox-e8854443-c2c7-488e-93d5-b9d93708b8a3'
    ) as HTMLInputElement

    expect(shopCheckbox1.checked).toEqual(true)
    expect(shopCheckbox2.checked).toEqual(true)
    expect(buyButton.disabled).toEqual(false)

    await userEvent.click(chooseAllCheckbox)
    expect(shopCheckbox1.checked).toEqual(false)
    expect(shopCheckbox2.checked).toEqual(false)
    expect(buyButton).toBeDisabled()

    await userEvent.click(chooseAllCheckbox)
    await userEvent.click(buyButton)
    expect(mockRouter.query).toHaveProperty('values')
    const queryVal = mockRouter.query.values

    const dec = CryptoJS.AES.decrypt(String(queryVal), secret).toString(
      CryptoJS.enc.Utf8
    )
    const tempValue = JSON.parse(dec) as CheckoutValues
    expect(tempValue.idProducts).toHaveLength(4)
  })

  it('can select and deselect a shop', async () => {
    renderWithProviders(<Cart />)
    const buyButton = screen.getByTestId('button-buy') as HTMLButtonElement
    expect(buyButton).toBeDisabled()

    await userEvent.click(buyButton)

    const shopCheckbox1 = screen.getByTestId(
      'checkbox-a050cfb3-957c-4b35-83cb-ff65095c6eb5'
    ) as HTMLInputElement
    await userEvent.click(shopCheckbox1)
    expect(shopCheckbox1.checked).toEqual(true)
    expect(buyButton.disabled).toEqual(false)

    await userEvent.click(shopCheckbox1)
    expect(shopCheckbox1.checked).toEqual(false)
    expect(buyButton).toBeDisabled()

    await userEvent.click(shopCheckbox1)
    expect(buyButton.disabled).toEqual(false)
    await userEvent.click(buyButton)

    expect(mockRouter.query).toHaveProperty('values')
    const queryVal = mockRouter.query.values

    const dec = CryptoJS.AES.decrypt(String(queryVal), secret).toString(
      CryptoJS.enc.Utf8
    )
    const tempValue = JSON.parse(dec) as CheckoutValues
    expect(tempValue.idProducts).toHaveLength(1)
  })
})
