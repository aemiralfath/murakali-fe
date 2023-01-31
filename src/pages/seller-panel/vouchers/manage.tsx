import { useGetSellerDetailInformation } from '@/api/seller'
import {
  useCreateVouchers,
  useSellerVoucherDetail,
  useUpdateVouchers,
} from '@/api/seller/voucher'
import { Button, Chip, H2, H4, P, TextInput } from '@/components'
import { useMediaQuery } from '@/hooks'

import SellerPanelLayout from '@/layout/SellerPanelLayout'

import type { APIResponse } from '@/types/api/response'
import type { CreateUpdateVoucher } from '@/types/api/voucher'
import type { AxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiArrowLeft } from 'react-icons/hi'

function ManageVouchers() {
  const router = useRouter()
  const md = useMediaQuery('md')

  const [id, setId] = useState<string>()
  const [edit, setEdit] = useState<boolean>(false)
  const [duplicate, setDuplicate] = useState<boolean>(false)
  const sellerVoucher = useSellerVoucherDetail(id)
  const createVoucher = useCreateVouchers()
  const updateVoucher = useUpdateVouchers(id)
  const [selected, setSelected] = useState<'P' | 'F'>('P')
  const [SellerName, setSellerName] = useState('')

  const voucherId = router.query.voucher
  const typeManage = router.query.type
  useEffect(() => {
    if (typeof voucherId === 'string') {
      setId(voucherId)
    }
  }, [voucherId])

  useEffect(() => {
    if (sellerVoucher.isSuccess) {
      if (typeManage === 'update') {
        setInput({
          code: sellerVoucher.data?.data?.code,
          quota: sellerVoucher.data?.data?.quota,
          actived_date: moment(sellerVoucher.data?.data?.actived_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          expired_date: moment(sellerVoucher.data?.data?.expired_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          discount_percentage: sellerVoucher.data?.data?.discount_percentage,
          discount_fix_price: sellerVoucher.data?.data?.discount_fix_price,
          min_product_price: sellerVoucher.data?.data?.min_product_price,
          max_discount_price: sellerVoucher.data?.data?.max_discount_price,
        })
        setEdit(true)
      } else if (typeManage === 'duplicate') {
        setInput({
          code: '',
          quota: sellerVoucher.data?.data?.quota,
          actived_date: moment(sellerVoucher.data?.data?.actived_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          expired_date: moment(sellerVoucher.data?.data?.expired_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          discount_percentage: sellerVoucher.data?.data?.discount_percentage,
          discount_fix_price: sellerVoucher.data?.data?.discount_fix_price,
          min_product_price: sellerVoucher.data?.data?.min_product_price,
          max_discount_price: sellerVoucher.data?.data?.max_discount_price,
        })
        setDuplicate(true)
      }

      if (sellerVoucher.data?.data?.discount_fix_price > 0) {
        setSelected('F')
      }
    }
  }, [sellerVoucher.isSuccess])

  const useSellerDetailInformation = useGetSellerDetailInformation()

  const [input, setInput] = useState<CreateUpdateVoucher>({
    code: '',
    quota: 0,
    actived_date: '',
    expired_date: '',
    discount_percentage: 0,
    discount_fix_price: 0,
    min_product_price: 1,
    max_discount_price: 0,
  })

  useEffect(() => {
    if (useSellerDetailInformation.isSuccess) {
      setSellerName(
        useSellerDetailInformation.data?.data?.name
          .slice(0, 8)
          .replace(/\s/g, '')
          .toUpperCase() + '-'
      )
    }
  }, [useSellerDetailInformation.isSuccess])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (createVoucher.isSuccess) {
      if (duplicate) {
        toast.success('Successfully Duplicate Voucher')
      } else {
        toast.success('Successfully Create Voucher')
      }
      router.push('/seller-panel/vouchers')

      setInput({
        code: '',
        quota: 0,
        actived_date: '',
        expired_date: '',
        discount_percentage: 0,
        discount_fix_price: 0,
        min_product_price: 1,
        max_discount_price: 0,
      })
      setDuplicate(false)
      setEdit(false)
    }
    if (updateVoucher.isSuccess) {
      toast.success('Successfully Update Voucher')
      router.push('/seller-panel/vouchers')
      setInput({
        code: '',
        quota: 0,
        actived_date: '',
        expired_date: '',
        discount_percentage: 0,
        discount_fix_price: 0,
        min_product_price: 1,
        max_discount_price: 0,
      })
    }
  }, [createVoucher.isSuccess, updateVoucher.isSuccess])

  useEffect(() => {
    if (createVoucher.isError) {
      const errmsg = createVoucher.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
    if (updateVoucher.isError) {
      const errmsg = updateVoucher.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createVoucher.isError, updateVoucher.isError])

  const handleCreateUpdateVoucher = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const letterNumber = /^[0-9a-zA-Z]+$/

    if (!input.code.match(letterNumber) && !edit) {
      toast.error('input code must alphabet')
      return
    }

    let bodyInput: CreateUpdateVoucher

    if (selected === 'F') {
      bodyInput = {
        code: SellerName + input.code.toUpperCase(),
        actived_date: moment(input.actived_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        discount_fix_price: Number(input.discount_fix_price),
        discount_percentage: 0,
        expired_date: moment(input.expired_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        max_discount_price: Number(input.discount_fix_price),
        min_product_price: Number(input.min_product_price),
        quota: Number(input.quota),
      }
    } else {
      bodyInput = {
        code: SellerName + input.code.toUpperCase(),
        actived_date: moment(input.actived_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        discount_fix_price: 0,
        discount_percentage: Number(input.discount_percentage),
        expired_date: moment(input.expired_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        max_discount_price: Number(input.max_discount_price),
        min_product_price: Number(input.min_product_price),
        quota: Number(input.quota),
      }
    }

    if (edit) {
      updateVoucher.mutate(bodyInput)
    } else {
      createVoucher.mutate(bodyInput)
    }
  }
  return (
    <div>
      <Head>
        <title>Murakali | Voucher Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="voucher">
        <div className="flex flex-col items-baseline justify-between gap-2 px-3 py-5 sm:flex-row sm:px-0">
          <H2>{edit ? 'Edit' : duplicate ? 'Duplicate' : 'Add'} Voucher</H2>
          <Button
            size="sm"
            buttonType="primary"
            outlined
            onClick={() => {
              router.back()
            }}
          >
            <HiArrowLeft /> Back{' '}
          </Button>
        </div>

        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 px-5 ">
          <form
            className=" mt-1 gap-y-3"
            onSubmit={(e) => {
              void handleCreateUpdateVoucher(e)
              return false
            }}
          >
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className=" flex flex-wrap items-center gap-3">
                    <H4>Code Voucher</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <P className="mt-2 max-w-[20rem] text-sm">
                    Code Voucher, code maximum 5 characters
                  </P>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                {edit ? (
                  <></>
                ) : (
                  <>
                    <P className="mr-2 w-fit font-mono font-semibold">
                      {SellerName}
                    </P>
                  </>
                )}

                <TextInput
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={input.code.toUpperCase()}
                  full
                  maxLength={5}
                  required
                  label={md ? undefined : 'Code Voucher'}
                  disabled={edit}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className="flex items-center gap-3">
                    <H4>Quota</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <P className="mt-2 max-w-[20rem] text-sm">Voucher Quota</P>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                <TextInput
                  type="number"
                  name="quota"
                  placeholder="quota"
                  onChange={handleChange}
                  value={input.quota}
                  maxLength={8}
                  full
                  label={md ? undefined : 'Quota'}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className="flex items-center gap-3">
                    <H4>Active Date</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <P className="mt-2 max-w-[20rem] text-sm">
                    Active Voucher Date
                  </P>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                <TextInput
                  type="datetime-local"
                  name="actived_date"
                  onChange={handleChange}
                  max={
                    input.expired_date === ''
                      ? ''
                      : moment(input.expired_date).format('YYYY-MM-DD HH:mm')
                  }
                  min={
                    !duplicate
                      ? moment(Date.now()).format('YYYY-MM-DD HH:mm')
                      : moment(sellerVoucher.data?.data?.actived_date).format(
                          'YYYY-MM-DD HH:mm'
                        )
                  }
                  value={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                  label={md ? undefined : 'Active Date'}
                  full
                  disabled={
                    Date.now() >= Date.parse(input.actived_date) && edit
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className="flex items-center gap-3">
                    <H4>Expired Date</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <div className="mt-2 max-w-[20rem] text-sm">
                    Expired Voucher Date
                    {input.actived_date === '' ? (
                      <P className="font-bold">
                        Please input active date first, before input exporired
                        date
                      </P>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                <TextInput
                  type="datetime-local"
                  name="expired_date"
                  onChange={handleChange}
                  max={
                    Date.now() >= Date.parse(input.actived_date) &&
                    Date.now() <= Date.parse(input.expired_date) &&
                    edit
                      ? input.expired_date
                      : ''
                  }
                  min={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                  value={moment(input.expired_date).format('YYYY-MM-DD HH:mm')}
                  full
                  label={md ? undefined : 'Expired Date'}
                  disabled={input.actived_date === ''}
                  required
                />
              </div>
            </div>
            <div className="label-text mt-5 block">
              <H4 className="font-sans font-normal md:font-heading md:font-semibold">
                Select Voucher Type (Discount Persentage/Fix Price)
              </H4>
            </div>
            <div className=" mt-1 flex flex-row flex-wrap gap-4">
              <div>
                <label className="flex items-center gap-1">
                  <input
                    onChange={() => {
                      setSelected('P')
                    }}
                    className={'radio-primary radio radio-xs'}
                    type="radio"
                    name="Discount"
                    checked={selected === 'P'}
                  />
                  Percentage
                </label>
              </div>
              <div>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="FixPrice"
                    className={'radio-primary radio radio-xs'}
                    checked={selected === 'F'}
                    onChange={() => {
                      setSelected('F')
                    }}
                  />
                  Fix Price
                </label>
              </div>
            </div>

            {selected === 'P' ? (
              <>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  {md ? (
                    <div className="w-[30%]">
                      <div className="flex items-center gap-3">
                        <H4>Discount Percentage</H4>
                        <Chip type={'gray'}>Required</Chip>
                      </div>
                      <P className="mt-2 max-w-[20rem] text-sm">
                        Please input Discount percentage
                      </P>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex flex-1 items-center">
                    <TextInput
                      type="number"
                      name="discount_percentage"
                      onChange={handleChange}
                      placeholder="persentage"
                      value={input.discount_percentage}
                      full
                      label={md ? undefined : 'Discount Percentage'}
                      maxLength={3}
                      min={1}
                      max={100}
                      required
                    />
                    <P className="mt-6 w-20 text-center text-lg font-bold md:mt-0">
                      %
                    </P>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  {md ? (
                    <div className="w-[30%]">
                      <div className="flex items-center gap-3">
                        <H4>Discount Fixed Price</H4>
                        <Chip type={'gray'}>Required</Chip>
                      </div>
                      <P className="mt-2 max-w-[20rem] text-sm">
                        Please input Discount Fixed Price
                      </P>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="flex flex-1 items-center">
                    <TextInput
                      type="number"
                      name="discount_fix_price"
                      leftIcon={'Rp. '}
                      onChange={handleChange}
                      placeholder="x.xxx"
                      value={input.discount_fix_price}
                      min={1}
                      label={md ? undefined : 'Discount (Fixed Price)'}
                      full
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className="flex items-center gap-3">
                    <H4>Max Discount Price</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <P className="mt-2 max-w-[20rem] text-sm">
                    Please input Max Discount
                  </P>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                <TextInput
                  type="number"
                  name="max_discount_price"
                  leftIcon={'Rp. '}
                  onChange={handleChange}
                  placeholder="x.xxx"
                  value={
                    selected === 'F'
                      ? input.discount_fix_price
                      : input.max_discount_price
                  }
                  disabled={selected === 'F'}
                  label={md ? undefined : 'Max Discount Price'}
                  full
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {md ? (
                <div className="w-[30%]">
                  <div className="flex items-center gap-3">
                    <H4>Min Product Price</H4>
                    <Chip type={'gray'}>Required</Chip>
                  </div>
                  <P className="mt-2 max-w-[20rem] text-sm">
                    Please input Min Product Price
                  </P>
                </div>
              ) : (
                <></>
              )}
              <div className="flex flex-1 items-center">
                <TextInput
                  type="number"
                  name="min_product_price"
                  leftIcon={'Rp. '}
                  onChange={handleChange}
                  placeholder="x.xxx"
                  value={input.min_product_price}
                  full
                  min={1}
                  label={md ? undefined : 'Min Discount Price'}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2 lg:justify-end">
              <Button
                type="button"
                outlined
                buttonType="primary"
                onClick={() => {
                  router.back()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" buttonType="primary">
                Save
              </Button>
            </div>
          </form>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default ManageVouchers
