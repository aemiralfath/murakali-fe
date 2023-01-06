import { useGetSellerProduct } from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'
import { useGetSellerCategory } from '@/api/seller/category'
import { Avatar, Button, H3 } from '@/components'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import { Transition } from '@headlessui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiMenu } from 'react-icons/hi'

function Seller() {
  const [selectedTab, setSelectedTab] = useState('')
  const param = useRouter()
  const [categoryOpen, setCategoryOpen] = useState(false)

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

  const sm = useMediaQuery('sm')
  console.log(sm)

  const sellerProfile = useGetSellerInfo(param.query.id as string)
  const sellerCategory = useGetSellerCategory(param.query.id as string)

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
          <div className="tabs-boxed grid w-full grid-cols-2 bg-base-300 sm:grid-cols-5 ">
            {sm ? (
              <div className="tabs col-span-4 flex-nowrap items-center space-x-5 overflow-auto">
                <button
                  onClick={() => setSelectedTab('')}
                  className={cx(
                    'tab-lg w-1/2 min-w-max text-center sm:w-1/4',
                    selectedTab === '' ? 'tab-active' : ''
                  )}
                >
                  All Item
                </button>
                {sellerCategory.data?.data.length <= 4 ? (
                  sellerCategory.data?.data.map((item, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedTab(item.name)}
                        className={cx(
                          'tab-lg w-1/4 min-w-max text-center',
                          selectedTab === item.name ? 'tab-active' : ''
                        )}
                      >
                        {item.name}
                      </button>
                    )
                  })
                ) : (
                  <>
                    {sellerCategory.data?.data
                      .slice(0, 3)
                      .map((item, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedTab(item.name)}
                            className={cx(
                              'tab-lg w-1/4 min-w-max text-center',
                              selectedTab === item.name ? 'tab-active' : ''
                            )}
                          >
                            {item.name}
                          </button>
                        )
                      })}
                  </>
                )}
              </div>
            ) : (
              <div className="tabs flex-nowrap items-center space-x-5 overflow-auto">
                <button
                  onClick={() => setSelectedTab('')}
                  className={cx(
                    'tab-lg w-full min-w-max text-center',
                    selectedTab === '' ? 'tab-active' : ''
                  )}
                >
                  All Item
                </button>
              </div>
            )}
            <>
              {sm ? (
                sellerCategory.data?.data.length > 4 ? (
                  <div className="dropdown-hover dropdown-end dropdown mx-auto w-full">
                    <label tabIndex={0} className="btn m-1 w-full ">
                      Other Category
                    </label>
                    <button
                      className="bg-transparent text-2xl text-white md:hidden "
                      type="button"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                    ></button>

                    <ul
                      tabIndex={0}
                      className="dropdown-hover dropdown-end dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                    >
                      {sellerCategory.data?.data
                        .slice(3, 999)
                        .map((item, index) => {
                          return (
                            <li key={index} className="">
                              <button
                                onClick={() => setSelectedTab(item.name)}
                                className={cx(
                                  'flexitems-center tab-lg my-auto min-w-max flex-auto justify-center px-10 text-center ',
                                  selectedTab === item.name ? 'tab-active' : ''
                                )}
                              >
                                {item.name}
                              </button>
                            </li>
                          )
                        })}
                    </ul>
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <>
                  <div className="dropdown-hover dropdown-end dropdown mx-auto w-full">
                    <label tabIndex={0} className="btn w-full ">
                      Other Category
                    </label>
                    <button
                      className="bg-transparent text-2xl text-white md:hidden "
                      type="button"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                    ></button>

                    <ul
                      tabIndex={0}
                      className="dropdown-end dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                    >
                      {sellerCategory.data?.data
                        .slice(0, 999)
                        .map((item, index) => {
                          return (
                            <li key={index} className="">
                              <button
                                onClick={() => setSelectedTab(item.name)}
                                className={cx(
                                  'flexitems-center tab-lg my-auto min-w-max flex-auto justify-center text-center ',
                                  selectedTab === item.name ? 'tab-active' : ''
                                )}
                              >
                                {item.name}
                              </button>
                            </li>
                          )
                        })}
                    </ul>
                  </div>
                </>
              )}
            </>
          </div>
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
