import { useGetUserProfile } from '@/api/user/profile'
import { useEffect, useState } from 'react'

import type { UserDetail } from '@/types/api/user'

const useUser = () => {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userProfile = useGetUserProfile()
  useEffect(() => {
    setIsLoading(userProfile.isLoading)
  }, [userProfile.isLoading])

  useEffect(() => {
    if (userProfile.isSuccess) {
      if (userProfile.data.data) {
        setUser(userProfile.data.data)
      }
    }
  }, [userProfile.data])

  useEffect(() => {
    if (userProfile.isError) {
      setUser(null)
    }
  }, [userProfile.isError])

  return { user, isLoading }
}

export { useUser }
