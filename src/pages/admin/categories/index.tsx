import {
  useAdminCategories,
  useCreateAdminCategories,
  useDeleteAdminCategories,
  useUpdateAdminCategories,
} from '@/api/admin/categories'
import { Button } from '@/components'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import Head from 'next/head'
import React from 'react'

function CategoriesAdmin() {
  const category = useAdminCategories()
  const deleteAdminCategory = useDeleteAdminCategories()
  // perlu dibikin ke page manage baru kaya voucher trus copy ini
  //   const createCategory = useCreateAdminCategories()
  //   const updateCategory = useUpdateAdminCategories()

  function deleteCategory(id: string) {
    deleteAdminCategory.mutate(id)
  }

  return (
    <div>
      <Head>
        <title>Admin | Murakali</title>
        <meta name="admin" content="Admin | Murakali E-Commerce Application" />
      </Head>
      <AdminPanelLayout selectedPage="category">
        <Button>Add New Category</Button>
        <div>
          {category.isLoading ? (
            <>asd</>
          ) : (
            category.data?.data.map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    category name : {item.name}|| level : {item.level}{' '}
                    <Button>edit</Button>
                    <Button
                      onClick={() => {
                        deleteCategory(item.id)
                      }}
                    >
                      delete
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
