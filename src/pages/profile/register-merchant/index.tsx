import { Button, H2, H4, P, TextInput } from '@/components'
import React, { useEffect } from 'react'
import { useModal } from '@/hooks'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import { useGetAllAddress, useGetDefaultAddress } from '@/api/user/address'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import AddressOption from '@/sections/checkout/option/AddressOption'
import { useRegistrationMerchant } from '@/api/auth/register-merchant'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useGetUserProfile } from '@/api/user/profile'

function MerchantRegistration() {
  const modal = useModal()
  const router = useRouter()
  const address = useGetDefaultAddress(false, true, true)

  const addresses = useGetAllAddress(1)

  const registerMerchant = useRegistrationMerchant()

  const userProfile = useGetUserProfile()

  useEffect(() => {
    if (userProfile.isSuccess) {
      if (userProfile.data.data.role === 2) {
        router.push('/merchant')
      }
    }
  }, [userProfile.isSuccess])

  const registrationMerchantForm = useFormik({
    initialValues: {
      shopName: '',
    },
    validationSchema: Yup.object({
      shopName: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .required('This field is required'),
    }),
    onSubmit: (values) => {
      registerMerchant.mutate(values)
    },
  })

  useEffect(() => {
    if (registerMerchant.isSuccess) {
      toast.success('Registration Merchant Success')
      router.push('/seller-panel')
    }
  }, [registerMerchant.isSuccess])

  useEffect(() => {
    if (registerMerchant.isError) {
      const reason = registerMerchant.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [registerMerchant.isError])

  useEffect(() => {
    if (addresses.isSuccess) {
      if (addresses.data?.data?.rows.length === 0) {
        toast.error('Please add your address first')
        router.push('/profile/address')
      }
    }
  }, [addresses.isSuccess])

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
        <div className="my-10 mx-2 grid grid-cols-1 gap-x-0 gap-y-2 md:mx-5 md:grid-cols-4 md:gap-x-5">
          <div className="col-span-2">
            <div
              className="hidden h-full rounded-lg border-solid border-slate-900 bg-cover bg-center p-8 shadow-2xl md:flex"
              style={{
                backgroundImage: 'url(/asset/abstract-bg.png)',
                border: '1px solid #E5E7EB',
              }}
            />
          </div>
          <div className="border-1 col-span-2 h-full rounded-lg border-solid border-slate-900 p-8 shadow-2xl">
            <form
              onSubmit={registrationMerchantForm.handleSubmit}
              className="grid grid-rows-6"
            >
              <div className="row-span-5">
                <div className="my-4 mx-2 grid grid-cols-1 gap-2">
                  <div className="col-span-1 flex justify-center border-b-4 p-2">
                    <H2>Registration Merchant</H2>
                  </div>
                  <div className="col-span-1 py-2">
                    {/* <label className="text-sm text-slate-600">Merchant Name</label> */}
                    <TextInput
                      type="text"
                      name="shopName"
                      placeholder="MUR"
                      required
                      full
                      label="Shop Name"
                      onChange={registrationMerchantForm.handleChange}
                      value={registrationMerchantForm.values.shopName}
                      errorMsg={
                        registrationMerchantForm.values.shopName !== '' &&
                        registrationMerchantForm.errors.shopName
                          ? registrationMerchantForm.errors.shopName
                          : ''
                      }
                    />
                  </div>
                  <div className="col-span-1 py-2">
                    <H4>Address</H4>
                    {address.isSuccess ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3">
                        <div className="col-span-2">
                          <P>
                            {address.data?.data?.rows[0].address_detail},{' '}
                            {address.data?.data?.rows[0].sub_district},{' '}
                            {address.data?.data?.rows[0].district},{' '}
                            {address.data?.data?.rows[0].city},{' '}
                            {address.data?.data?.rows[0].province}, Indonesia (
                            {address.data?.data?.rows[0].zip_code})
                          </P>
                        </div>
                        <div className="col-span-1 flex items-center justify-end px-2">
                          <Button
                            buttonType="primary"
                            size="sm"
                            type="button"
                            onClick={() => {
                              modal.info({
                                title: 'Choose Address',
                                content: (
                                  <AddressOption is_shop_address={true} />
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
                            type="button"
                            size="sm"
                            onClick={() => {
                              modal.info({
                                title: 'Choose Address',
                                content: (
                                  <AddressOption is_shop_address={true} />
                                ),
                                closeButton: false,
                              })
                            }}
                          >
                            Choose Address
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row-span-1 grid justify-items-end border-t-2 py-3 px-2">
                <Button
                  type="submit"
                  buttonType="primary"
                  isLoading={registerMerchant.isLoading}
                >
                  Register Merchant
                </Button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default MerchantRegistration
