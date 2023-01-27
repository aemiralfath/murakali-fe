import type { BannerResponse } from '@/types/api/banner'

const bannerData: BannerResponse[] = [
  {
    id: '1',
    title: '12.12 - 50% Off',
    content:
      'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
    image_url:
      'https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    page_url: 'https://picsum.photos/200/300',
    is_active: true,
  },
  {
    id: '2',
    title: 'Free Delivery',
    content:
      'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
    image_url:
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    page_url: 'https://picsum.photos/200/300',
    is_active: true,
  },
]

export default bannerData
