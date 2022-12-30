import { Button, H2, H4 } from '@/components'
import React from 'react'
import { useModal } from '@/hooks'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import ModalChooseAddress from '@/layout/template/profile/ModalChooseAddress'

const address = [
  {
    id: '8b9e5380-6906-43d6-bc76-a8c4a1943bc0',
    user_id: '101401ce-4a0f-11ed-9772-acde48001122',
    name: 'Rumah',
    province_id: 1,
    city_id: 1,
    province: 'DKI Jakarta',
    city: 'Jakarta',
    district: 'Kalideres',
    sub_district: 'Kalideres Permai',
    address_detail: 'jl. kalideres permai, kalideres',
    zip_code: '11840',
    is_default: true,
    is_shop_default: true,
  },
  {
    id: '8b9e5380-6906-43d6-bc76-a8c4a1943bc1',
    user_id: '101401ce-4a0f-11ed-9772-acde48001123',
    name: 'Kantor',
    province_id: 1,
    city_id: 1,
    province: 'DKI Jakarta',
    city: 'Jakarta',
    district: 'Kalideres',
    sub_district: 'Kalideres Permai',
    address_detail: 'jl. kalideres permai 2, kalideres',
    zip_code: '11841',
    is_default: false,
    is_shop_default: false,
  },
]

function MerchantRegistration() {
  const modal = useModal()
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
            <img
              src={
                'data:image/png;base64,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'
              }
              width="100%"
            />
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
                                  <ModalChooseAddress address={address} />
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
