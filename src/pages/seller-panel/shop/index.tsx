import { H2 } from '@/components'

import Head from 'next/head'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
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
