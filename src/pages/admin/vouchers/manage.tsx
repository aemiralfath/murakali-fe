import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  useAdminVoucherDetail,
  useCreateAdminVouchers,
  useUpdateAdminVouchers,
} from '@/api/admin/voucher'
import { Button, Chip, H2, H4, P, TextInput } from '@/components'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import type { APIResponse } from '@/types/api/response'
import type { CreateUpdateVoucher } from '@/types/api/voucher'

import type { AxiosError } from 'axios'
import moment from 'moment'

function ManageVouchersAdmin() {
  const router = useRouter()

  const [id, setId] = useState<string>('')
  const [edit, setEdit] = useState<boolean>(false)
  const [duplicate, setDuplicate] = useState<boolean>(false)
  const adminVoucher = useAdminVoucherDetail(id)
  const createVoucher = useCreateAdminVouchers()
  const updateVoucher = useUpdateAdminVouchers(id)
  const [selected, setSelected] = useState<'P' | 'F'>('P')

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

  const voucherId = router.query.voucher
  const typeManage = router.query.type
  useEffect(() => {
    if (typeof voucherId === 'string') {
      setId(voucherId)
    }
  }, [voucherId])

  useEffect(() => {
    if (adminVoucher.isSuccess) {
      if (typeManage === 'update') {
        setInput({
          code: adminVoucher.data?.data?.code ?? '',
          quota: adminVoucher.data?.data?.quota ?? 0,
          actived_date: moment(adminVoucher.data?.data?.actived_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          expired_date: moment(adminVoucher.data?.data?.expired_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          discount_percentage:
            adminVoucher.data?.data?.discount_percentage ?? 0,
          discount_fix_price: adminVoucher.data?.data?.discount_fix_price ?? 0,
          min_product_price: adminVoucher.data?.data?.min_product_price ?? 0,
          max_discount_price: adminVoucher.data?.data?.max_discount_price ?? 0,
        })
        setEdit(true)
      } else if (typeManage === 'duplicate') {
        setInput({
          code: '',
          quota: adminVoucher.data?.data?.quota ?? 0,
          actived_date: moment(adminVoucher.data?.data?.actived_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          expired_date: moment(adminVoucher.data?.data?.expired_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          discount_percentage:
            adminVoucher.data?.data?.discount_percentage ?? 0,
          discount_fix_price: adminVoucher.data?.data?.discount_fix_price ?? 0,
          min_product_price: adminVoucher.data?.data?.min_product_price ?? 0,
          max_discount_price: adminVoucher.data?.data?.max_discount_price ?? 0,
        })
        setDuplicate(true)
      }

      if (
        typeof adminVoucher.data?.data?.discount_fix_price === 'number' &&
        adminVoucher.data?.data?.discount_fix_price > 0
      ) {
        setSelected('F')
      }
    }
  }, [adminVoucher.isSuccess])

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
      router.push('/admin/vouchers')

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
      setDuplicate(false)
      setEdit(false)
    }
    if (updateVoucher.isSuccess) {
      toast.success('Successfully Update Voucher')
      router.push('/admin/vouchers')
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

    if (!input.code.match(letterNumber)) {
      toast.error('input code must alphabet')
      return
    }

    let bodyInput: CreateUpdateVoucher

    if (selected === 'F') {
      bodyInput = {
        code: input.code.toUpperCase(),
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
        code: input.code.toUpperCase(),
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
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="voucher">
        <div className="flex  w-full items-center justify-start">
          <H2>{edit ? 'Edit' : duplicate ? 'Duplicate' : 'Add'} Voucher</H2>
        </div>

        <div className="md:px-18 mt-3 flex h-full flex-col rounded border bg-white p-6 px-5 lg:px-52 ">
          <form
            className=" mt-1 gap-y-3"
            onSubmit={(e) => {
              void handleCreateUpdateVoucher(e)
              return false
            }}
          >
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Code Voucher</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">Code Voucher</P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={input.code.toUpperCase()}
                  full
                  required
                  disabled={edit}
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
                  max={
                    input.expired_date === ''
                      ? ''
                      : moment(input.expired_date).format('YYYY-MM-DD HH:mm')
                  }
                  min={moment(Date.now()).format('YYYY-MM-DD HH:mm')}
                  value={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                  full
                  disabled={
                    Date.now() >= Date.parse(input.actived_date) && edit
                  }
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
                  disabled={input.actived_date === ''}
                  required
                />
              </div>
            </div>
            <div className="label-text mt-5 block">
              <H4>Select Voucher Type (Discount Percentage/Fix Price)</H4>
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
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Discount Percentage</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Please input Discount Percentage
                    </P>
                  </div>
                  <div className="flex flex-1 items-center">
                    <TextInput
                      type="number"
                      name="discount_percentage"
                      onChange={handleChange}
                      placeholder="percentage"
                      value={input.discount_percentage}
                      full
                      maxLength={3}
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
      </AdminPanelLayout>
    </div>
  )
}

export default ManageVouchersAdmin
