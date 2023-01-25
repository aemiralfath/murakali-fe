import { useSellerOrders } from '@/api/seller/order'
import { Button, H2 } from '@/components'
import Table from '@/components/table'
import orderStatusData from '@/dummy/orderStatusData'
import type { OrderData } from '@/types/api/order'
import type { PaginationData } from '@/types/api/response'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import cx from '@/helper/cx'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import ProcessDelivery from '@/sections/seller-panel/delivery-servise/ProcessDelivery'
import CancelDelivery from '@/sections/seller-panel/delivery-servise/CancelDelivery'
import ManageProfileSeller from '@/sections/seller-panel/profile/ManageProfileSeller'
import ManageAddressSeller from '@/sections/seller-panel/profile/ManageAddressSeller'

function Profile() {
  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="shop">
        <H2>Shop Information</H2>
        <ManageProfileSeller />

        <ManageAddressSeller />
      </SellerPanelLayout>
    </div>
  )
}

export default Profile
