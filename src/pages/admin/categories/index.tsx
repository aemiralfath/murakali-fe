import {
  useAdminCategories,
  useDeleteAdminCategories,
} from '@/api/admin/categories'
import { Button } from '@/components'
import AdminPanelLayout from '@/layout/AdminPanelLayout'
import Head from 'next/head'
import router from 'next/router'
import React from 'react'
import { HiPlus } from 'react-icons/hi'

function CategoriesAdmin() {
  const category = useAdminCategories()
  const deleteAdminCategory = useDeleteAdminCategories()

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
        <div>
          {category.isLoading ? (
            <>asd</>
          ) : (
            category.data?.data.map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    category name : {item.name}|| level : {item.level}{' '}
                    <Button
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
                      edit
                    </Button>
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
