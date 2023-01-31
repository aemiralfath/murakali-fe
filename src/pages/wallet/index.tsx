import { useGetUserWallet, useGetUserWalletHistory } from '@/api/user/wallet'
import { Button, H1, H2, P, PaginationNav, Spinner } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import FormPasswordVerification from '@/sections/wallet/FormPasswordVerification'
import FormTopUp from '@/sections/wallet/FormTopUp'
import TransactionDetail from '@/sections/wallet/TransactionDetail'
import moment from 'moment'
import React, { useState } from 'react'
import { HiArrowDown, HiArrowUp } from 'react-icons/hi'
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa'
import cx from '@/helper/cx'
import FormPINWallet from '@/sections/wallet/FormPinWallet'
import { HiLockClosed, HiSave, HiStatusOnline } from 'react-icons/hi'

function Wallet() {
  const userWallet = useGetUserWallet()
  const modal = useModal()

  const [page, setPage] = useState<number>(1)
  const [sorts, setSorts] = useState('DESC')
  const userWalletHistory = useGetUserWalletHistory(page, sorts)

  return (
    <>
      <Navbar />
      <TitlePageExtend title="My Wallet" />

      <div className=" container mx-auto my-5  grid h-fit grid-cols-1 gap-3  px-5 lg:px-20  xl:grid-cols-3 ">
        <div className=" h-96  rounded-lg border-[1px] border-solid border-gray-300 py-7 px-5">
          {userWallet.isLoading ? (
            <div className="flex justify-center">
              <Spinner color="gray" />
            </div>
          ) : userWallet.isError ? (
            <div className="flex flex-col items-center justify-center">
              <P className="text-center font-bold text-gray-500">
                You Dont Have Wallet, Click Button Bellow and input your pin to
                activated wallet
              </P>
              <div className="flex justify-around py-4">
                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Activate Wallet',
                      content: <FormPINWallet createPin={true} />,
                      closeButton: false,
                    })
                  }}
                >
                  <HiStatusOnline /> Active Wallet
                </Button>
              </div>
            </div>
          ) : userWallet.data?.data ? (
            <>
              {' '}
              <div className="flex justify-start">
                <div>
                  <P className="font-bold">Wallet Number</P>
                  <P className="font-bold text-primary">
                    {userWallet.data.data.id}
                  </P>
                </div>
              </div>
              <div className="flex flex-row flex-wrap items-center justify-between py-7 ">
                <div>
                  <P className="font-bold">Ballance</P>
                  <H1 className="text-primary">
                    Rp. {formatMoney(userWallet.data.data.balance)}
                  </H1>
                </div>
                <div>
                  <Button
                    buttonType="primary"
                    onClick={() => {
                      modal.edit({
                        title: 'Top Up',
                        content: (
                          <>
                            <FormTopUp />
                          </>
                        ),
                        closeButton: false,
                      })
                    }}
                  >
                    <HiSave />
                    Top Up
                  </Button>
                </div>
              </div>
              <hr></hr>
              <div className="flex justify-around py-4">
                <Button
                  className="w-fit sm:w-full"
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Pin',
                      content: <FormPasswordVerification />,
                      closeButton: false,
                    })
                  }}
                >
                  <HiLockClosed /> Change Pin
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="h-min-[100vh] col-span-2 rounded-lg border-[1px] border-solid border-gray-300 py-5 ">
          <H2 className="mx-5">Transaction History</H2>

          <div className="flex items-center gap-x-2 px-5">
            <P className="my-3  font-bold">Sort</P>
            <button
              className={cx(
                'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                sorts === 'ASC' ? 'bg-primary text-xs text-white' : ''
              )}
              onClick={() => {
                setSorts('ASC')
              }}
            >
              <HiArrowUp />
            </button>
            <button
              className={cx(
                'flex aspect-square h-[1.5rem] items-center justify-center rounded-full border text-xs',
                sorts === 'DESC' ? 'bg-primary text-xs text-white' : ''
              )}
              onClick={() => {
                setSorts('DESC')
              }}
            >
              <HiArrowDown />
            </button>
          </div>

          {userWalletHistory.isLoading ? (
            <div className="flex justify-center">
              <Spinner color="gray" />
            </div>
          ) : userWalletHistory.data?.data ? (
            userWalletHistory.data.data.rows.map((data, index) => (
              <div
                key={index}
                className=" bg-white py-3 hover:bg-slate-300"
                onClick={() => {
                  if (userWallet.data?.data) {
                    modal.info({
                      title: 'Transaction Detail',
                      content: (
                        <TransactionDetail
                          walletID={userWallet.data.data.id}
                          walletHistoryID={data.id}
                        />
                      ),
                      closeButton: true,
                    })
                  }
                }}
              >
                <div className="mx-6 grid grid-cols-1 border-b-[0.5px] border-gray-400 pb-3 md:grid-cols-2">
                  <div className="flex gap-1">
                    {data.to === userWallet.data?.data?.id ? (
                      <FaAngleDoubleRight className="my-[2.5px] text-green-600" />
                    ) : (
                      <FaAngleDoubleLeft className="my-[2.5px] text-red-600" />
                    )}

                    <div className="flex flex-col">
                      <P className="font-bold">{data.description}</P>
                      <P className="text-sm text-gray-500">
                        {moment(data.created_at).format(
                          'dddd, DD-MM-YYYY HH:mm'
                        )}
                      </P>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {data.to === userWallet.data?.data?.id ? (
                      <P className="font-bold text-green-600">
                        + Rp. {formatMoney(data.amount)}
                      </P>
                    ) : (
                      <></>
                    )}
                    {data.from === userWallet.data?.data?.id ? (
                      <P className="font-bold text-red-600">
                        - Rp. {formatMoney(data.amount)}
                      </P>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}

          {(userWalletHistory.isError && !userWalletHistory.isLoading) ||
          (userWalletHistory.data?.data &&
            userWalletHistory.data?.data?.rows.length <= 0) ? (
            <>
              <P className="text-center font-bold text-gray-500">
                History is Empty
              </P>
            </>
          ) : (
            <></>
          )}

          {!userWalletHistory.isLoading && userWalletHistory.data?.data ? (
            userWalletHistory.data.data.total_rows !== 0 ? (
              <div className="mt-4 flex w-full justify-center">
                <PaginationNav
                  total={userWalletHistory.data.data.total_pages ?? 1}
                  page={page}
                  onChange={(page: number) => {
                    setPage(page)
                  }}
                  size="sm"
                />
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Wallet
