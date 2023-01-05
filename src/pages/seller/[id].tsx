import { useGetSellerProduct } from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'
import { useGetSellerCategory } from '@/api/seller/category'
import { Avatar, H3 } from '@/components'
import cx from '@/helper/cx'
import MainLayout from '@/layout/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Seller() {
  const [selectedTab, setSelectedTab] = useState('')
  const param = useRouter()

  const product = useGetSellerProduct(
    1,
    10,
    '',
    selectedTab,
    param.query.id as string,
    '',
    '',
    0,
    0,
    0,
    0
  )

  const sellerProfile = useGetSellerInfo(param.query.id as string)
  const sellerCategory = useGetSellerCategory(param.query.id as string)
  return (
    // bikin fungsi untuk ngefetch category product sesuai dengan category yg dipilih
    <>
      <div>
        <Head>
          <title>Seller | Murakali</title>
          <meta name="description" content="Murakali E-Commerce Application" />
        </Head>
        <MainLayout>
          <div className="rounded-lg  border-solid  py-5 px-8">
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
                    {sellerProfile.data?.data.total_rating} Rating
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
          <div className="flex-grow  overflow-x-auto">
            <div className="tabs tabs-boxed min-w-fit flex-nowrap justify-start bg-base-300">
              <button
                onClick={() => setSelectedTab('')}
                className={cx(
                  ' tab-lg my-auto flex w-52 items-center justify-center text-center',
                  selectedTab === '' ? 'tab-active' : ''
                )}
              >
                All Item
              </button>
              {sellerCategory.data?.data.map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTab(item.name)}
                    className={cx(
                      ' tab-lg my-auto flex w-52 items-center justify-center text-center',
                      selectedTab === item.name ? 'tab-active' : ''
                    )}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
