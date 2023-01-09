import { useGetSellerInfo } from '@/api/seller'
import { useGetSellerCategory } from '@/api/seller/category'
import { H2, P } from '@/components'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import type { CategoryData } from '@/types/api/category'

const CategoryTab: React.FC<{
  categories: CategoryData[]
  selectedTab: string
  setSelectedTab: (s: string) => void
}> = ({ selectedTab, setSelectedTab, categories }) => {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const sm = useMediaQuery('sm')

  return (
    <div className="tabs-boxed z-10 grid w-full grid-cols-2 bg-primary bg-opacity-10 sm:grid-cols-5 ">
      {sm ? (
        <div className="tabs col-span-4 flex-nowrap items-center space-x-5 overflow-auto">
          <button
            onClick={() => setSelectedTab('')}
            className={cx(
              'tab-lg w-1/2 min-w-max text-center text-base sm:w-1/4',
              selectedTab === '' ? 'tab-active' : ''
            )}
          >
            All Item
          </button>
          {categories.length <= 4 ? (
            categories.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setSelectedTab(item.name)}
                  className={cx(
                    'tab-lg w-1/4 min-w-max text-center text-base',
                    selectedTab === item.name ? 'tab-active' : ''
                  )}
                >
                  {item.name}
                </button>
              )
            })
          ) : (
            <>
              {categories.slice(0, 3).map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTab(item.name)}
                    className={cx(
                      'tab-lg w-1/4 min-w-max text-center text-base',
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
              'tab-lg w-full min-w-max text-center text-base',
              selectedTab === '' ? 'tab-active' : ''
            )}
          >
            All Item
          </button>
        </div>
      )}
      <>
        {sm ? (
          categories.length > 4 ? (
            <div className="dropdown-hover dropdown-end dropdown mx-auto w-full">
              <label
                tabIndex={0}
                className="btn-outline btn-primary btn w-full border-0 text-base font-normal"
              >
                Other Category
              </label>
              <button
                className="bg-transparent text-2xl text-white md:hidden "
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
              ></button>

              <ul
                tabIndex={0}
                className="dropdown-end dropdown-hover dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                {categories.slice(3, 999).map((item, index) => {
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
            <div className="dropdown-end dropdown-hover dropdown mx-auto w-full">
              <label
                tabIndex={0}
                className="btn-outline btn-primary btn w-full border-0 text-base font-normal"
              >
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
                {categories.slice(0, 999).map((item, index) => {
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
  )
}

function Seller() {
  const [selectedTab, setSelectedTab] = useState('')
  const param = useRouter()

  // const product = useGetSellerProduct(
  //   1,
  //   10,
  //   '',
  //   selectedTab,
  //   param.query.id as string,
  //   '',
  //   '',
  //   0,
  //   0,
  //   0,
  //   0
  // )

  const md = useMediaQuery('md')

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
          <div className="rounded bg-primary bg-opacity-5 py-5">
            <div className="flex flex-col items-center sm:flex-row">
              {sellerProfile.data?.data ? (
                <>
                  <div className="relative -z-0 mb-6 flex h-[150px] w-[150px] justify-center rounded-full sm:mb-0 md:h-[200px] md:w-[200px]">
                    <Image
                      src={sellerProfile.data.data.photo_url}
                      alt={sellerProfile.data.data.name}
                      className={'z-10 rounded-full object-cover shadow-lg'}
                      fill
                    />
                    <div className="absolute top-1/2 left-1/2 -z-0 hidden h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white sm:block md:h-[280px] md:w-[280px]" />
                    <div className="absolute top-1/2 left-0 -z-0 hidden h-[300px]  w-[150px] -translate-y-1/2 -translate-x-[50%] bg-white sm:block md:w-[300px]" />
                  </div>
                  <div className="z-10 col-span-4 ml-[30px] flex w-full flex-grow flex-col px-1 sm:w-auto sm:px-3 md:ml-[40px] md:px-5">
                    <H2 className="mb-3 flex flex-col gap-4 font-normal leading-3 md:mb-0 md:flex-row md:leading-normal">
                      Shop Name
                      <span className="font-extrabold leading-snug text-primary">
                        {sellerProfile.data.data.name}
                      </span>
                    </H2>
                    <P className="mt-2 flex gap-4">
                      Total Product
                      <span className="text-primary">
                        {sellerProfile.data.data.total_product} Products
                      </span>
                    </P>
                    <P className="flex gap-4">
                      Total Rating
                      <span className="text-primary">
                        {sellerProfile.data.data.total_rating} Rating
                      </span>
                    </P>
                    <P className="mb-2 flex items-start gap-4">
                      Rating Avg
                      <span className="flex items-center gap-1 text-primary">
                        <AiFillStar className="text-accent" />{' '}
                        {sellerProfile.data.data.rating_avg} Rating
                      </span>
                    </P>
                    {md ? (
                      sellerCategory.data.data ? (
                        <CategoryTab
                          categories={sellerCategory.data.data}
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                        />
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {!md ? (
            sellerCategory.data.data ? (
              <CategoryTab
                categories={sellerCategory.data.data}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </MainLayout>
      </div>
    </>
  )
}

export default Seller
