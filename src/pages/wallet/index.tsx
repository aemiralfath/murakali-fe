import { useGetUserWallet, useGetUserWalletHistory } from '@/api/user/wallet'
import { Button, H1, H2, P, PaginationNav } from '@/components'
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

      <div className=" container mx-auto my-5  grid h-fit grid-cols-1 gap-3 px-20  lg:grid-cols-3">
        <div className=" h-fit rounded-lg border-[1px] border-solid border-gray-300 py-7 px-5">
          {userWallet.isLoading ? (
            <></>
          ) : userWallet.data.data ? (
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
              <div className="flex items-center justify-between py-7 ">
                <div>
                  <P className="font-bold">Ballance</P>
                  <H1 className="text-primary">
                    Rp. {formatMoney(userWallet.data.data.balance)}
                  </H1>
                </div>
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
                  Top Up
                </Button>
              </div>
              <hr></hr>
              <div className="flex justify-around py-4">
                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Pin',
                      content: <FormPasswordVerification />,
                      closeButton: false,
                    })
                  }}
                >
                  Change Pin
                </Button>

                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Withdraw',
                      content: <></>,
                      closeButton: false,
                    })
                  }}
                >
                  Withdraw
                </Button>
              </div>
            </>
          ) : (
            <>
              <P>You Dont Have Wallet, please activate your wallet</P>
              <div className="flex justify-around py-4">
                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Pin',
                      content: <></>,
                      closeButton: false,
                    })
                  }}
                >
                  Active Wallet
                </Button>
              </div>
            </>
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
            <></>
          ) : userWalletHistory.data.data.rows ? (
            userWalletHistory.data.data.rows.map((data, index) => (
              <div
                key={index}
                className=" bg-white py-3 hover:bg-slate-300"
                onClick={() => {
                  modal.info({
                    title: 'Transaction Detail',
                    content: <TransactionDetail transactionId={data.id} />,
                    closeButton: true,
                  })
                }}
              >
                <div className="mx-6 grid grid-cols-1 border-b-[0.5px] border-gray-400 pb-3 md:grid-cols-2">
                  <div className="flex gap-1">
                    {data.amount.toString().includes('-') ? (
                      <FaAngleDoubleLeft className="my-[2.5px] text-red-600" />
                    ) : (
                      <FaAngleDoubleRight className="my-[2.5px] text-green-600" />
                    )}

                    <div className="flex flex-col">
                      <P className="font-bold">{data.description}</P>
                      <P className="text-sm text-gray-500">
                        {moment(data.created_at).format('DD-MM-YYYY HH:mm')}
                      </P>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {data.amount.toString().includes('-') ? (
                      <P className="font-bold text-red-600">
                        Rp. {formatMoney(data.amount)}
                      </P>
                    ) : (
                      <P className="font-bold text-green-600">
                        + Rp. {formatMoney(data.amount)}
                      </P>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}

          {!userWalletHistory.isLoading && userWalletHistory.data.data ? (
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
