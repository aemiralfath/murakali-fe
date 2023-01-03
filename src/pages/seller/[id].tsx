import { useGetSellerProduct } from '@/api/product'
import { Avatar, H3 } from '@/components'
import MainLayout from '@/layout/MainLayout'
import Head from 'next/head'

function Seller() {
  const userProfile = useGetSellerProduct(
    2,
    1,
    'rose'
    // 'test2',
    // 'abc',
    // 'categoryName',
    // 'asc'
  )
  // eslint-disable-next-line no-console
  console.log(userProfile)

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
                <Avatar
                  size="lg"
                  url={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                />
              </div>

              <div className="col-span-4 mx-5 flex-grow ">
                <H3 className=" mt-5 flex gap-4">
                  Shop Name
                  <span className="text-blue-700">Fajar Shop</span>{' '}
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Total Product
                  <span className="text-blue-700">159 Products</span>
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Total Rating
                  <span className="text-blue-700">10k Rating </span>
                </H3>
                <H3 className=" mt-5 flex gap-4">
                  Rating Avg
                  <span className="text-blue-700">4,7</span>
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
