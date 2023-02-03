import React from 'react'
import { FaTicketAlt, FaPercent } from 'react-icons/fa'

import { P, Button } from '@/components'
import formatMoney from '@/helper/formatMoney'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { VoucherData } from '@/types/api/voucher'

import { Menu } from '@headlessui/react'
import type { UseQueryResult } from '@tanstack/react-query'
import moment from 'moment'

const MarketplaceVoucherMenu: React.FC<{
  voucher: VoucherData
  setVoucher: (v: VoucherData) => void
  voucherMarketplace: UseQueryResult<
    APIResponse<PaginationData<VoucherData>>,
    unknown
  >
}> = ({ voucher, setVoucher, voucherMarketplace }) => {
  return (
    <Menu>
      <Menu.Button className="btn-outline btn-primary btn  m-1 w-full gap-4">
        {voucher.code ? (
          <div className="flex-start flex items-center gap-2">
            <FaTicketAlt />
            <div className="flex flex-col">
              <P>{voucher.code}</P>
              {voucher.discount_percentage > 0 ? (
                <P>{voucher.discount_percentage}%</P>
              ) : (
                <P>Rp. {voucher.discount_fix_price}</P>
              )}
            </div>
          </div>
        ) : (
          <>
            <FaPercent /> Save With Vouchers
          </>
        )}
      </Menu.Button>

      {voucherMarketplace.isSuccess &&
      voucherMarketplace.data?.data &&
      voucherMarketplace.data.data.rows !== null ? (
        voucherMarketplace.data.data.rows.length > 0 ? (
          <div>
            <Menu.Items className="absolute max-h-52 w-80 origin-top-left divide-y divide-gray-100  overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
              {voucherMarketplace.data?.data &&
              voucherMarketplace.data?.data.rows.length > 0 ? (
                voucherMarketplace.data?.data?.rows.map((data, index) => (
                  <div className="px-1" key={index}>
                    {data.quota <= 0 ? (
                      <>
                        <Menu.Item>
                          {() => (
                            <Button
                              disabled
                              className="btn mx-auto mb-1 h-fit w-full gap-1  border-4 border-solid  border-primary bg-gray-500 py-2 
                            text-start text-white "
                            >
                              <a className="flex flex-col items-center ">
                                <span className="text-lg  font-bold">
                                  Discount{' '}
                                  {data.discount_percentage > 0 ? (
                                    <>{data.discount_percentage}%</>
                                  ) : (
                                    <>
                                      Rp. {formatMoney(data.discount_fix_price)}
                                    </>
                                  )}
                                </span>
                                <span className=" text-md  max-w-[80%] truncate break-words">
                                  {data.code}
                                </span>

                                <span className=" text-xs ">
                                  Min. Rp. {formatMoney(data.min_product_price)}
                                </span>

                                <span className=" text-xs ">
                                  until{' '}
                                  {moment(data.expired_date).format(
                                    'DD MMM YYYY '
                                  )}{' '}
                                </span>
                              </a>
                            </Button>
                          )}
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          {() => (
                            <Button
                              onClick={() => {
                                setVoucher(data)
                              }}
                              className="btn my-1 mx-auto h-fit w-full gap-1  border-4 border-solid  border-primary bg-white py-2 
                            text-start text-primary hover:border-white hover:bg-primary hover:text-white"
                            >
                              <a className="flex flex-col items-center ">
                                <span className="text-lg  font-bold">
                                  Discount{' '}
                                  {data.discount_percentage > 0 ? (
                                    <>{data.discount_percentage}%</>
                                  ) : (
                                    <>
                                      Rp. {formatMoney(data.discount_fix_price)}
                                    </>
                                  )}
                                </span>
                                <span className=" text-md max-w-[80%] truncate break-words">
                                  {data.code}
                                </span>
                                <span className=" text-xs ">
                                  Min. Rp. {formatMoney(data.min_product_price)}
                                </span>

                                <span className=" text-xs ">
                                  until{' '}
                                  {moment(data.expired_date).format(
                                    'DD MMM YYYY '
                                  )}{' '}
                                </span>
                              </a>
                            </Button>
                          )}
                        </Menu.Item>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div>Empty</div>
              )}
            </Menu.Items>
          </div>
        ) : (
          <Menu.Items className="absolute h-10 w-56 origin-top-left divide-y divide-gray-100  overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
            <div className=" p-2">
              <P className=" text-center">No Voucher Available</P>
            </div>
          </Menu.Items>
        )
      ) : (
        <></>
      )}
    </Menu>
  )
}

export default MarketplaceVoucherMenu
