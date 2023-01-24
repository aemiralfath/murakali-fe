import { useLogout } from '@/api/auth/logout'
import { Avatar, Button, Icon } from '@/components'

import { useMediaQuery, useUser } from '@/hooks'
import type { APIResponse } from '@/types/api/response'
import { Transition } from '@headlessui/react'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'

import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

const SectionOneSideBarAdmin: React.FC = ({}) => {
  const { user } = useUser()

  const sm = useMediaQuery('sm')

  const router = useRouter()

  const logout = useLogout()

  useEffect(() => {
    if (logout.isSuccess) {
      toast.success('Logout Success')
    }
  }, [logout.isSuccess])
  useEffect(() => {
    if (logout.isError) {
      const reason = logout.failureReason as AxiosError<APIResponse<null>>
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [logout.isError])

  return (
    <>
      <nav
        className={`relative flex flex-wrap items-center justify-between bg-white px-2 py-5 shadow-md`}
      >
        <div className="mx-auto flex w-screen flex-wrap items-center justify-between gap-2 px-3">
          <div className="relative flex justify-between ">
            <div className="mx-1 flex max-w-[2rem] items-center sm:max-w-[6rem]">
              <Icon color="primary" small={!sm} />
            </div>
          </div>
          <div className="text-heading relative flex flex-1 items-center text-xl font-semibold text-primary">
            Admin
          </div>
          {user ? (
            <div className={'hidden items-center md:flex'}>
              <ul className="flex list-none flex-col md:ml-auto md:flex-row">
                <li className="nav-item mx-6 flex items-center">
                  <div className="h-full w-[1px] bg-base-300"></div>
                </li>
                <li className="nav-item flex items-center">
                  <Button
                    buttonType="ghost"
                    onClick={() => {
                      router.push('/login')
                      logout.mutate()
                    }}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
      <Transition
        show={false}
        enter={'transition-transform duration-50'}
        enterFrom={'scale-y-0'}
        enterTo={'scale-y-100'}
        leave={'transition-transform duration-50'}
        leaveFrom={'scale-y-100'}
        leaveTo={'scale-y-0'}
        className={'block origin-top md:hidden'}
      >
        <div className="bg-primary px-5 pb-3">
          {user ? (
            <ul className="container mx-auto flex list-none flex-col gap-2">
              <li className="nav-item flex items-center gap-2 text-sm text-white hover:opacity-75">
                <Avatar size="sm" url={user.photo_url} />
                <div>{user.full_name}</div>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </Transition>
    </>
  )
}

export default SectionOneSideBarAdmin
