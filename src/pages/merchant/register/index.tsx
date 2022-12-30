import { Button, H2, H4 } from '@/components'
import React, { useEffect } from 'react'
import { useModal } from '@/hooks'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import { useGetAllAddress, useGetDefaultAddress } from '@/api/user/address'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

function MerchantRegistration() {
  const modal = useModal()
  const router = useRouter()
  const address = useGetDefaultAddress(false, true)

  const addresses = useGetAllAddress(1)

  useEffect(() => {
    if (addresses.isSuccess) {
      if (addresses.data?.data?.rows.length === 0) {
        toast.error('Please add your address first')
        router.push('/profile/address')
      }
    }
  }, [address.isSuccess])

  return (
    <>
      <Head>
        <title>Merchant Registration | Murakali</title>
        <meta
          name="description"
          content="Merchant Registration | Murakali E-Commerce Application"
        />
      </Head>
      <MainLayout>
        <div className="my-10 mx-2 grid grid-cols-1 gap-x-0 gap-y-2 md:mx-5 md:grid-cols-4 md:gap-x-5 lg:mx-32">
          <div className="col-span-2">
            <image width="100%" />
          </div>
          <div className="border-1 col-span-2 h-full rounded-lg border-solid border-slate-900 p-8 shadow-2xl">
            <div className="grid grid-rows-6">
              <div className="row-span-5">
                <div className="my-4 mx-2 grid grid-cols-1 gap-2">
                  <div className="col-span-1 flex justify-center border-b-4 p-2">
                    <H2>Registration Merchant</H2>
                  </div>
                  <div className="col-span-1 py-2">
                    {/* <label className="text-sm text-slate-600">Merchant Name</label> */}
                    <input
                      className="w-full rounded-lg border-2 border-solid border-slate-300 p-2 shadow-md"
                      type="text"
                      placeholder="Shop Name"
                    />
                  </div>
                  <div className="col-span-1 py-2">
                    <H4>Address</H4>
                    {address.isSuccess ? (
                      address.data?.data?.rows.length !== 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="col-span-2">
                            Samuel Manunggal | 081234567890
                            <br />
                            Jln Raya Cibubur No. 123
                            <br />
                            Jakarta Timur
                            <br />
                            55161
                          </div>
                          <div className="col-span-1 flex items-center justify-end px-2">
                            <Button
                              buttonType="primary"
                              size="sm"
                              onClick={() => {
                                modal.edit({
                                  title: 'Choose Address',
                                  content: (
                                    <>
                                      {/* <ModalChooseAddress address={address} /> */}
                                    </>
                                  ),
                                  closeButton: false,
                                })
                              }}
                            >
                              Choose Address
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="col-span-2">
                            Please add your address first for merchant
                          </div>
                          <div className="col-span-1 flex items-center justify-end px-2">
                            <Button
                              buttonType="primary"
                              size="sm"
                              onClick={() => {
                                modal.edit({
                                  title: 'Choose Address',
                                  content: (
                                    <>
                                      {/* <ModalChooseAddress address={address} /> */}
                                    </>
                                  ),
                                  closeButton: false,
                                })
                              }}
                            >
                              Choose Address
                            </Button>
                          </div>
                        </div>
                      )
                    ) : (
                      'Loading...'
                    )}
                  </div>
                  <div className="col-span-1 py-2">
                    {/* <label className="text-sm text-slate-600">Merchant Name</label> */}
                    <input
                      disabled
                      className="w-full rounded-lg border-2 border-solid border-slate-300 p-2 shadow-md"
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-span-1 py-2">
                    {/* <label className="text-sm text-slate-600">Merchant Name</label> */}
                    <input
                      disabled
                      className="w-full rounded-lg border-2 border-solid border-slate-300 p-2 shadow-md"
                      type="text"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
              <div className="row-span-1 grid justify-items-end border-t-2 py-3 px-2">
                <Button buttonType="primary" size="sm">
                  Register Merchant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default MerchantRegistration
