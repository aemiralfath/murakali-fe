import { useGetSellerProduct } from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'
import { Avatar, H3 } from '@/components'
import MainLayout from '@/layout/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'

function Seller() {
  const product = useGetSellerProduct(
    2,
    1,
    'rose'
    // 'test2',
    // 'abc',
    // 'categoryName',
    // 'asc'
  )
  const param = useRouter()
  const sellerProfile = useGetSellerInfo(param.query.id as string)

  return (
    <>
      <div>
        <Head>
          <title>Seller | Murakali</title>
          <meta name="description" content="Murakali E-Commerce Application" />
        </Head>
        <MainLayout>
          <div className="border-grey-200  rounded-lg border-[1px] border-solid py-5 px-8">
            <div className="sm:flex ">
              <div className="flex justify-center">
                <Avatar size="lg" url={sellerProfile.data?.data.photo_url} />
              </div>

              <div className="col-span-4 mx-5 flex-grow ">
                <H3 className=" mt-5 flex gap-4">
                  Shop Name
                  <span className="text-blue-700">
                    {sellerProfile.data?.data.name}
                  </span>
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Total Product
                  <span className="text-blue-700">
                    {sellerProfile.data?.data.total_product} Products
                  </span>
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Total Rating
                  <span className="text-blue-700">
                    {sellerProfile.data?.data.total_rating} Rating{' '}
                  </span>
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Rating Avg
                  <span className="text-blue-700">
                    {sellerProfile.data?.data.rating_avg}
                  </span>
                </H3>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
