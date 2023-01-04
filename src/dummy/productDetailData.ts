import type { Product } from '@/types/api/product'

const dummyBreadcrumbs = [
  { name: 'Jewelry & Watches', link: '#' },
  { name: 'Watches, Parts & Accessories', link: '#' },
  { name: 'Watches', link: '#' },
]

const dummyProductImages = [
  'https://cf.shopee.co.id/file/814ca3bda16a4ef301be591d10b30e5d',
  'https://cf.shopee.co.id/file/901b0c9dea21ebb0210ab0563c8468c2',
  'https://cf.shopee.co.id/file/94863ff0ea3ee5017dc7eea5f5eedaf4',
  'https://cf.shopee.co.id/file/89021cd9d1671e5c0a5819898888fcf0',
  'https://cf.shopee.co.id/file/f51dec13bd33ffd1e30e00a57fc21fff',
]

const product: Product = {
  product_info: {
    id: 'p1',
    sku: 'ABC123',
    title: 'My Product',
    description: 'This is a great product',
    view_count: 100,
    favorite_count: 50,
    unit_sold: 20,
    listed_status: true,
    thumbnail_url: 'https://example.com/product/thumbnail.jpg',
    rating_avg: 4.5,
    min_price: 10,
    max_price: 20,
    category_name: 'Fashion',
    category_url: 'https://example.com/category/fashion',
  },
  promotions_info: {
    discount_percentage: 10,
    discount_fix_price: 2,
    min_product_price: 5,
    max_discount_price: 15,
    quota: 100,
    max_quantity: 10,
    active_date: '2022-01-01',
    expired_date: '2022-12-31',
  },
  products_detail: [
    {
      id: 'pd1',
      price: 15,
      stock: 50,
      variant: {
        color: 'red',
        size: 'M',
      },
    },
    {
      id: 'pd2',
      price: 12,
      stock: 30,
      variant: {
        color: 'blue',
        size: 'L',
      },
    },
    {
      id: 'pd3',
      price: 10,
      stock: 20,
      variant: {
        color: 'green',
        size: 'XL',
      },
    },
  ],
}

export default product
export { dummyBreadcrumbs, dummyProductImages }
