import {
  useAdminCategories,
  useCreateAdminCategories,
  useUpdateAdminCategories,
} from '@/api/admin/categories'

import { Button, Chip, H2, H4, P, TextInput } from '@/components'
import Uploader from '@/components/uploader'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import type { CreateUpdateCategory } from '@/types/api/admincategory'

import type { APIResponse } from '@/types/api/response'
import { Listbox, Transition } from '@headlessui/react'
import type { AxiosError } from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function ManageCategoryAdmin() {
  const router = useRouter()

  const [, setId] = useState<string>()
  const [edit, setEdit] = useState<boolean>(false)
  const createCategory = useCreateAdminCategories()
  const updateCategory = useUpdateAdminCategories()
  const category = useAdminCategories()

  const categoryID = router.query.category
  const typeManage = router.query.type
  const [selected, setSelected] = useState('no parent category')

  useEffect(() => {
    if (typeof categoryID === 'string') {
      setId(categoryID)
    }
  }, [categoryID])

  useEffect(() => {
    if (typeManage === 'update' && categoryID) {
      category.data?.data
        .filter((item) => item.id === categoryID)
        .map((item) => setInput(item))

      setEdit(true)
    }
  }, [category.isSuccess])

  const [, setParent] = useState<CreateUpdateCategory>({
    id: '',
    name: '',
    photo_url: '',
    level: '',
    parent_id: '',
  })

  const [input, setInput] = useState<CreateUpdateCategory>({
    id: '',
    name: '',
    photo_url: '',
    level: '1',
    parent_id: '',
  })

  useEffect(() => {
    if (input.parent_id !== null) {
      category.data?.data
        .filter((item) => item.id === input.parent_id)
        .map((item) => {
          setSelected(item.name)
          setParent(item)
        })
    }
  }, [input])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (createCategory.isSuccess) {
      toast.success('Successfully Create Category')
      router.push('/admin/categories')

      setInput({
        id: '',
        name: '',
        photo_url: '',
        level: '',
        parent_id: '',
      })
      setEdit(false)
    }
    if (updateCategory.isSuccess) {
      toast.success('Successfully Update Category')
      router.push('/admin/categories')
      setInput({
        id: '',
        name: '',
        photo_url: '',
        level: '',
        parent_id: '',
      })
    }
  }, [createCategory.isSuccess, updateCategory.isSuccess])

  useEffect(() => {
    if (createCategory.isError) {
      const errmsg = createCategory.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
    if (updateCategory.isError) {
      const errmsg = updateCategory.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createCategory.isError, updateCategory.isError])

  const handleCreateUpdateCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (edit) {
      updateCategory.mutate(input)
    } else {
      createCategory.mutate(input)
    }
  }

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="category">
        <div className="flex  w-full items-center justify-start">
          <H2>{edit ? 'Edit' : 'Add'} Category</H2>
        </div>

        <div className="md:px-18 mt-3 flex h-full flex-col rounded border bg-white p-6 px-5 lg:px-52 ">
          <form
            className=" mt-1 gap-y-3"
            onSubmit={(e) => {
              void handleCreateUpdateCategory(e)
              return false
            }}
          >
            {edit ? (
              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <div className="w-[30%]">
                  <div className=" flex flex-wrap items-center gap-3">
                    <H4>Category ID</H4>
                  </div>
                </div>
                <div className="flex flex-1 items-center">
                  <TextInput
                    type="text"
                    value={input.id}
                    full
                    maxLength={10}
                    required
                    disabled={edit}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className=" flex flex-wrap items-center gap-3">
                  <H4>Category Name</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">
                  maximum 10 characters
                </P>
              </div>
              <div className="flex flex-1 items-center">
                <TextInput
                  type="text"
                  name="name" // harus sama kaya di state input
                  onChange={handleChange}
                  value={input.name}
                  full
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {edit ? (
              <>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Parent Category</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Select Parent Category
                    </P>
                  </div>
                  <div className="flex flex-1 items-center">
                    <div className="top-16 w-72">
                      <Listbox value={selected}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <Listbox.Option
                                onClick={() => {
                                  setSelected('no parent category')
                                  setInput((prev) => ({
                                    ...prev,
                                    ['parent_id']: '',
                                    ['level']: '1',
                                  }))
                                }}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-blue-500 text-white'
                                      : 'text-gray-900'
                                  }`
                                }
                                value={'no parent category'}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {'no parent category'}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                              {category.data?.data
                                .filter(
                                  (item) =>
                                    item.level === '1' || item.level === '2'
                                )
                                .map((item, index) => (
                                  <Listbox.Option
                                    key={index}
                                    onClick={() => {
                                      setSelected(item.name)
                                      setInput((prev) => ({
                                        ...prev,
                                        ['parent_id']: item.id,
                                        ['level']: String(
                                          Number(item.level) + 1
                                        ),
                                      }))
                                    }}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? 'bg-blue-500 text-white'
                                          : 'text-gray-900'
                                      }`
                                    }
                                    value={item.name}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal'
                                          }`}
                                        >
                                          {item.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-3">
                      <H4>Parent Category</H4>
                      <Chip type={'gray'}>Required</Chip>
                    </div>
                    <P className="mt-2 max-w-[20rem] text-sm">
                      Select Parent Category
                    </P>
                  </div>
                  <div className="flex flex-1 items-center">
                    <div className="top-16 w-72">
                      <Listbox value={selected}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <Listbox.Option
                                onClick={() => {
                                  setSelected('no parent category')
                                  setInput((prev) => ({
                                    ...prev,
                                    ['parent_id']: '',
                                    ['level']: '1',
                                  }))
                                }}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-blue-500 text-white'
                                      : 'text-gray-900'
                                  }`
                                }
                                value={'no parent category'}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {'no parent category'}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                              {category.data?.data
                                .filter(
                                  (item) =>
                                    item.level === '1' || item.level === '2'
                                )
                                .map((item, index) => (
                                  <Listbox.Option
                                    key={index}
                                    onClick={() => {
                                      setSelected(item.name)
                                      setInput((prev) => ({
                                        ...prev,
                                        ['parent_id']: item.id,
                                        ['level']: String(
                                          Number(item.level) + 1
                                        ),
                                      }))
                                    }}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? 'bg-blue-500 text-white'
                                          : 'text-gray-900'
                                      }`
                                    }
                                    value={item.name}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal'
                                          }`}
                                        >
                                          {item.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="w-[30%]">
                <div className="flex items-center gap-3">
                  <H4>Category Photo</H4>
                  <Chip type={'gray'}>Required</Chip>
                </div>
                <P className="mt-2 max-w-[20rem] text-sm">New Category Photo</P>
              </div>
              <div className="flex flex-1">
                <div className="">
                  <Uploader
                    id={'admincategoryimage'}
                    title={'Photo'}
                    onChange={(s) =>
                      setInput((prev) => ({
                        ...prev,
                        ['photo_url']: s,
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
