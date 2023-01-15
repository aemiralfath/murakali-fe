import { useGetAllCategory } from '@/api/category'
import { H2 } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import ProductInfo from '@/sections/sellerpanel/addproduct/ProductInfo'
import ProductShipping from '@/sections/sellerpanel/addproduct/ProductShipping'
import ProductVariants from '@/sections/sellerpanel/addproduct/ProductVariants'
import UploadPhoto from '@/sections/sellerpanel/addproduct/UploadPhoto'
import Head from 'next/head'
import React from 'react'

const AddProduct = () => {
  const allCategory = useGetAllCategory()

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="product">
        <div className="flex w-full items-center justify-between">
          <H2>Add Product</H2>
        </div>
        <UploadPhoto />
        <ProductInfo categoryData={allCategory.data?.data} />
        <ProductVariants />
        <ProductShipping />
      </SellerPanelLayout>
    </div>
  )
}

export default AddProduct
