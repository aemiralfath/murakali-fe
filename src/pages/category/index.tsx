import { useGetAllCategory } from '@/api/category'
import { Breadcrumbs, Chip, P } from '@/components'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import Link from 'next/link'
import React from 'react'

const dummyBreadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'All Categories', link: '/category' },
]

function Category() {
  const useCategory = useGetAllCategory()

  return (
    <div>
      <Navbar />

      <TitlePageExtend title="All Categories" />
      <div className="px: lg:px-15 container mx-auto    my-8 mb-10 min-h-screen w-full ">
        <div className="my-4">
          <Breadcrumbs data={dummyBreadcrumbs} />
        </div>
        <div className="flex  flex-wrap  justify-between gap-y-8  px-2">
          {useCategory.isLoading ? (
            <>Loading</>
          ) : (
            <>
              {useCategory.data?.data?.length > 0 ? (
                <>
                  {useCategory.data?.data?.map((levelOne, index) => (
                    <div
                      key={'levelOne-' + index}
                      className=" min-h-[50px] w-full rounded-tl-2xl rounded-br-2xl border-[1px] border-solid border-gray-300 bg-white  lg:w-[48%] "
                    >
                      <div className="flex w-fit items-center  justify-center rounded-tl-2xl rounded-br-2xl bg-primary px-3 pt-5 pb-5 md:px-10">
                        <Link
                          href={`/cat/${levelOne.name}`}
                          className="  text-xl font-bold text-white hover:text-gray-100"
                        >
                          {levelOne.name.toLocaleUpperCase()}
                        </Link>
                      </div>

                      <div className="my-5 mx-4 flex flex-wrap lg:mx-10 ">
                        {levelOne.child_category.length > 0 ? (
                          levelOne.child_category.map((levelTwo, index) => (
                            <div
                              key={'levelTwo-' + index}
                              className="w-fit lg:w-1/2"
                            >
                              <Link href={`/cat/${levelTwo.name}`}>
                                <Chip
                                  className="font-bold hover:bg-primary"
                                  type="secondary"
                                >
                                  {' '}
                                  {levelTwo.name}
                                </Chip>
                              </Link>

                              <div className="flex  flex-wrap gap-x-3 gap-y-1 py-2">
                                {levelOne.child_category.length > 0 ? (
                                  levelOne.child_category.map(
                                    (levelThree, index) => (
                                      <Link
                                        key={'levelThree-' + index}
                                        href={`/cat/${levelThree.name}`}
                                        className="ml-2 text-gray-600 hover:text-primary"
                                      >
                                        {levelThree.name}
                                      </Link>
                                    )
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <P className="text-gray-500 ">No Sub Category</P>
                        )}

                        <div></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Category
