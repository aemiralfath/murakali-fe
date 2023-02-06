import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useCreateAdminBanner } from '@/api/admin/banner'
import { Button, Chip, H2, H4, P, TextInput } from '@/components'
import Uploader from '@/components/uploader'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import type { BannerData } from '@/types/api/banner'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

function ManageCategoryAdmin() {
  const router = useRouter()
  const createBanner = useCreateAdminBanner()

  const [input, setInput] = useState<BannerData>({
    id: '',
    title: '',
    content: '',
    image_url: '',
    page_url: '',
    is_active: false,
  })

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (createBanner.isSuccess) {
      toast.success('Successfully Create Category')
      router.push('/admin/banner')

      setInput({
        id: '',
        title: '',
        content: '',
        image_url: '',
        page_url: '',
        is_active: false,
      })
    }
  }, [createBanner.isSuccess])

  useEffect(() => {
    if (createBanner.isError) {
      const errmsg = createBanner.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createBanner.isError])

  const handleCreateBanner = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    createBanner.mutate(input)
  }

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="banner">
        <div className="flex  w-full items-center justify-start">
          <H2>Add Banner</H2>
        </div>

        <div className="md:px-18 mt-3 flex h-full flex-col rounded border bg-white p-6 px-5 lg:px-52 ">
          <form
            className=" mt-1 gap-y-3"
            onSubmit={(e) => {
              void handleCreateBanner(e)
              return false
            }}
          >
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Banner Title</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  maximum 17 characters
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="text"
                  name="title"
                  onChange={handleChange}
                  full
                  maxLength={17}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Banner Content</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  maximum 50 characters
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="text"
                  name="content"
                  onChange={handleChange}
                  full
                  maxLength={50}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Page URL</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">URL for more info</P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="text"
                  name="page_url"
                  onChange={handleChange}
                  full
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Banner Image</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">New Banner Image</P>
              </div>
              <div className="flex flex-1">
                <div className="">
                  <Uploader
                    id={'admincategoryimage'}
                    title={'Photo'}
                    aspect={5 / 3}
                    onChange={(s) =>
                      setInput((prev) => ({
                        ...prev,
                        ['image_url']: s,
                      }))
                    }
                  />
                </div>
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

export default ManageCategoryAdmin
