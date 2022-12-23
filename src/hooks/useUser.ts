import { useGetUserProfile } from '@/api/user/profile'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

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
      setUser(userProfile.data.data)
    }
  }, [userProfile.data])

  return { user, isLoading }
}

const useProtectedUser = () => {
  const router = useRouter()

  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userProfile = useGetUserProfile()
  useEffect(() => {
    setIsLoading(userProfile.isLoading)
  }, [userProfile.isLoading])

  useEffect(() => {
    if (userProfile.isError) {
      toast.error('Session ended, please log in again')
      router.push('/')
    }
  }, [userProfile.isError])

  useEffect(() => {
    if (userProfile.isSuccess) {
      setUser(userProfile.data.data)
    }
  }, [userProfile.data])

  return { user, isLoading }
}

export { useUser, useProtectedUser }
