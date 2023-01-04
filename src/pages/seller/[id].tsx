import { useGetSellerProduct } from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'
import { Avatar, H3 } from '@/components'
import cx from '@/helper/cx'
import MainLayout from '@/layout/MainLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

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

  const [selectedTab, setSelectedTab] = useState('')

  return (
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
          <div className="flex-grow ">
            <div className="tabs tabs-boxed flex justify-between bg-base-300">
              <button
                onClick={() => setSelectedTab('tab-1')}
                className={cx(
                  ' tab-lg my-auto flex w-52 items-center justify-center text-center',
                  selectedTab === 'tab-1' ? 'tab-active' : ''
                )}
              >
                Shipping Option
              </button>
              <a className="tab-lg my-auto flex w-52 items-center justify-center text-center">
                Tab 2
              </a>
              <a className="tab-lg my-auto flex w-52 items-center justify-center text-center">
                Tab 3
              </a>
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn-outline btn-primary  btn m-1 gap-2"
                >
                  Shipping Option
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
                >
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
