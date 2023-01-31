import {
  useAdminBanner,
  useDeleteAdminBanner,
  useUpdateAdminBanner,
} from '@/api/admin/banner'
import { Button, H3 } from '@/components'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import Head from 'next/head'
import router from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiPlus, HiTrash } from 'react-icons/hi'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'

function BannerAdmin() {
  const banner = useAdminBanner()
  const deleteAdminBanner = useDeleteAdminBanner()
  const updateBanner = useUpdateAdminBanner()

  const dispatch = useDispatch()

  function deleteBanner(id: string) {
    deleteAdminBanner.mutate(id)
  }

  function handleUpdateBanner(id: string, is_active: boolean) {
    updateBanner.mutate({ id, is_active })
  }
  useEffect(() => {
    if (deleteAdminBanner.isSuccess) {
      toast.success('Successfully delete banner')
      dispatch(closeModal())
    }
  }, [deleteAdminBanner.isSuccess])

  useEffect(() => {
    if (deleteAdminBanner.isError) {
      const errmsg = deleteAdminBanner.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteAdminBanner.isError])

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="banner">
        <div className="flex justify-between">
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.push({
                pathname: '/admin/banner/manage',
              })
            }}
          >
            <HiPlus /> Add Banner
          </Button>
        </div>
        <div className="my-5">
          <div className="grid grid-cols-4 gap-2 p-2 font-bold">
            <H3 className="text-center">Banner Title</H3>
            <H3 className="text-center">Banner Content</H3>
            <H3 className="text-center">Activate Banner</H3>
            <H3 className="text-center">Delete </H3>
          </div>
          {banner.isLoading ? (
            <>Loading...</>
          ) : (
            banner.data?.data?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-2 p-2 transition-all hover:bg-slate-200"
                >
                  <div className="text-center">{item.title}</div>
                  <div className="text-center">{item.content}</div>
                  <div className="text-center">
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={item.is_active}
                      readOnly
                      onClick={() => {
                        handleUpdateBanner(item.id, !item.is_active)
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      className="btn-error"
                      type="button"
                      onClick={() => {
                        deleteBanner(item.id)
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

export default BannerAdmin
