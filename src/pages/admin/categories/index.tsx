import {
  useAdminCategories,
  useDeleteAdminCategories,
} from '@/api/admin/categories'
import { Button, H3 } from '@/components'
import { useDispatch } from '@/hooks'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Head from 'next/head'
import router from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiOutlinePencil, HiPlus, HiTrash } from 'react-icons/hi'

function CategoriesAdmin() {
  const category = useAdminCategories()
  const deleteAdminCategory = useDeleteAdminCategories()
  const dispatch = useDispatch()

  function deleteCategory(id: string) {
    deleteAdminCategory.mutate(id)
  }

  useEffect(() => {
    if (deleteAdminCategory.isSuccess) {
      toast.success('Successfully delete category')
      dispatch(closeModal())
    }
  }, [deleteAdminCategory.isSuccess])

  useEffect(() => {
    if (deleteAdminCategory.isError) {
      const errmsg = deleteAdminCategory.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteAdminCategory.isError])

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="category">
        <div className="flex justify-between">
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.push({
                pathname: '/admin/categories/manage',
                query: {
                  category: '',
                  type: '',
                },
              })
            }}
          >
            <HiPlus /> Add Category
          </Button>
        </div>
        <div className="my-5">
          <div className="grid grid-cols-3 gap-2 p-2 font-bold">
            <H3 className="text-center">Category</H3>
            <H3 className="text-center">Category Level</H3>
            <H3 className="text-center">Activity</H3>
          </div>
          {category.isLoading ? (
            <>Loading...</>
          ) : (
            category.data?.data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-2 p-2 transition-all hover:bg-slate-400"
                >
                  <div className="text-center">{item.name}</div>
                  <div className="text-center">{item.level}</div>
                  <div className="text-center">
                    <Button
                      className="mx-3"
                      type="button"
                      buttonType="primary"
                      onClick={() => {
                        router.push({
                          pathname: '/admin/categories/manage',
                          query: {
                            category: item.id,
                            type: 'update',
                          },
                        })
                      }}
                    >
                      <HiOutlinePencil />
                      edit
                    </Button>
                    <Button
                      className="btn-error"
                      type="button"
                      onClick={() => {
                        deleteCategory(item.id)
                      }}
                    >
                      <HiTrash />
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </AdminPanelLayout>
    </div>
  )
}

export default CategoriesAdmin
