import { useGetUserProfile } from '@/api/user/profile'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Merchant = () => {
  const router = useRouter()
  const userProfile = useGetUserProfile()

  useEffect(() => {
    if (userProfile.isSuccess) {
      if (userProfile.data.data.role !== 2) {
        router.push('/merchant/register')
      }
    }
  }, [userProfile.isSuccess])

  return <div>ini Merchant page</div>
}

export default Merchant
