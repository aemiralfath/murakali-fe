import Head from 'next/head'

import { H2 } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import ManageAddressSeller from '@/sections/seller-panel/profile/ManageAddressSeller'
import ManageProfileSeller from '@/sections/seller-panel/profile/ManageProfileSeller'

function Profile() {
  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="shop">
        <div className="flex flex-col items-baseline justify-between gap-2 px-3 py-5 sm:flex-row sm:px-0">
          <H2>Shop Information</H2>
        </div>
        <ManageProfileSeller />
        <ManageAddressSeller />
      </SellerPanelLayout>
    </div>
  )
}

export default Profile
