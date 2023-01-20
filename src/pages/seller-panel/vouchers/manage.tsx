import { useGetSellerDetailInformation } from '@/api/seller'
import { useCreateVouchers } from '@/api/seller/voucher'
import { Button, Chip, H2, H4, P, TextInput } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { CreateUpdateVoucher } from '@/types/api/voucher'
import type { AxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function ManageVouchers() {
  const createVoucher = useCreateVouchers()
  //   const updateVoucher = useUpdateVouchers()

  const useSellerDetailInformation = useGetSellerDetailInformation()
  const dispatch = useDispatch()
  const router = useRouter()
  const [input, setInput] = useState<CreateUpdateVoucher>({
    code: '',
    quota: 0,
    actived_date: '',
    expired_date: '',
    discount_percentage: 0,
    discount_fix_price: 0,
    min_product_price: 0,
    max_discount_price: 0,
  })

  const [selected, setSelected] = useState<'P' | 'F'>('P')

  const [SellerName, setSellerName] = useState('')
  useEffect(() => {
    if (useSellerDetailInformation.isSuccess) {
      setSellerName(
        (useSellerDetailInformation.data?.data?.name).replace(' ', '-')
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
      toast.success('Successfully Create Voucher')
      router.push('/seller-panel/vouchers')
      void dispatch(closeModal())
      setInput({
        code: '',
        quota: 0,
        actived_date: '',
        expired_date: '',
        discount_percentage: 0,
        discount_fix_price: 0,
        min_product_price: 0,
        max_discount_price: 0,
      })
    }
  }, [createVoucher.isSuccess])

  useEffect(() => {
    if (createVoucher.isError) {
      const errmsg = createVoucher.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createVoucher.isError])

  const handleCreateVoucher = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const letterNumber = /^[0-9a-zA-Z]+$/

    if (!input.code.match(letterNumber)) {
      toast.error('input code must alphabet')
      return
    }

    if (selected === 'F') {
      createVoucher.mutate({
        code: SellerName + '-' + input.code.toUpperCase(),
        actived_date: moment(input.actived_date)
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        discount_fix_price: Number(input.discount_fix_price),
        discount_percentage: 0,
        expired_date: moment(input.expired_date)
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        max_discount_price: Number(input.discount_fix_price),
        min_product_price: Number(input.min_product_price),
        quota: Number(input.quota),
      })
    } else {
      createVoucher.mutate({
        code: SellerName + '-' + input.code.toUpperCase(),
        actived_date: moment(input.actived_date)
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        discount_fix_price: 0,
        discount_percentage: Number(input.discount_percentage),
        expired_date: moment(input.expired_date)
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        max_discount_price: Number(input.max_discount_price),
        min_product_price: Number(input.min_product_price),
        quota: Number(input.quota),
      })
    }
  }
  return (
    <div>
      <Head>
        <title>Murakali | Voucher Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="voucher">
        <div className="flex  w-full items-center justify-start">
          <H2>Manage Voucher</H2>
        </div>

        <div className="md:px-18 mt-3 flex h-full flex-col rounded border bg-white p-6 px-5 lg:px-52 ">
          <form
            className=" mt-1 gap-y-3"
            onSubmit={(e) => {
              void handleCreateVoucher(e)
              return false
            }}
          >
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Code Voucher</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  Code Voucher, code maximum 5 characters
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <P className="w-32 font-bold">{SellerName}</P>
                <TextInput
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={input.code.toUpperCase()}
                  full
                  maxLength={5}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Quota</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">Voucher Quota</P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="number"
                  name="quota"
                  placeholder="quota"
                  onChange={handleChange}
                  value={input.quota}
                  full
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Active Date</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  Active Voucher Date
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="datetime-local"
                  name="actived_date"
                  onChange={handleChange}
                  min={moment(Date.now()).format('YYYY-MM-DD HH:mm')}
                  placeholder={String(Date.now())}
                  value={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                  full
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Expired Date</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  Expired Voucher Date
                  {input.actived_date === '' ? (
                    <P className="font-bold">
                      Please input active date first, before input exporired
                      date
                    </P>
                  ) : (
                    <></>
                  )}
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="datetime-local"
                  name="expired_date"
                  onChange={handleChange}
                  min={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                  placeholder={String(Date.now())}
                  value={moment(input.expired_date).format('YYYY-MM-DD HH:mm')}
                  full
                  disabled={input.actived_date === ''}
                  required
                />
              </div>
            </div>
            <div className="label-text mt-5 block">
              <H4>Select Voucher Type (Discount Persentage/Fix Price)</H4>
            </div>
            <div className="mx-5 flex flex-row flex-wrap gap-2">
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
                  Persentage
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
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Discount Persentage</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Please input Discount persentage
                    </P>
                  </div>
                  <div className="flex flex-1 items-center">
                    <TextInput
                      type="number"
                      name="discount_percentage"
                      onChange={handleChange}
                      placeholder="persentage"
                      value={input.discount_percentage}
                      full
                      min={1}
                      max={100}
                      required
                    />
                    <P className="w-20 text-center text-lg font-bold">%</P>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Discount Fix Price</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Please input Discount Fix Price
                    </P>
                  </div>
                  <div className="flex flex-1 items-center">
                    <TextInput
                      type="number"
                      name="discount_fix_price"
                      leftIcon={'Rp. '}
                      onChange={handleChange}
                      placeholder="x.xxx"
                      value={input.discount_fix_price}
                      min={1}
                      full
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Max Discount Price</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  Please input Max Discount
                </P>
              </div>
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
                  full
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Min Product Price</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  Please input Min Product Price
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="number"
                  name="min_product_price"
                  leftIcon={'Rp. '}
                  onChange={handleChange}
                  placeholder="x.xxx"
                  value={input.min_product_price}
                  full
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-2 lg:justify-end">
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
