import { A, Avatar, Button, Divider, H1, P } from '@/components'
import { useGetUserProfile } from '@/api/user/profile'

import moment from 'moment'

import { useModal } from '@/hooks'
import React from 'react'
import Head from 'next/head'
import FormEditProfile from '@/layout/template/profile/FormEditProfile'
import FormChangeProfilePicture from '@/layout/template/profile/FormChangeProfilePicture'
import ProfileLayout from '@/layout/ProfileLayout'
import { HiPencil } from 'react-icons/hi'

function ManageProfile() {
  const modal = useModal()

  const userProfile = useGetUserProfile()

  return (
    <>
      <Head>
        <title>Profile | Murakali</title>
        <meta
          name="description"
          content="Profile | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="profile">
        <>
          <H1 className="text-primary">My Profile</H1>
          <div className="my-4">
            <Divider />
          </div>
          <div className=" mx-2 mt-8 grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center">
                <Avatar size="lg" url={userProfile.data?.data?.photo_url} />
              </div>
              <A
                className="flex items-center gap-1"
                onClick={() => {
                  modal.edit({
                    title: 'Change Profile Picture',
                    content: (
                      <>
                        <FormChangeProfilePicture />
                      </>
                    ),
                    closeButton: false,
                  })
                }}
              >
                <HiPencil /> Edit Profile Picture
              </A>
            </div>

            <div className="col-span-2 mt-8 flex flex-col gap-2 sm:mt-0 ">
              {!userProfile.isLoading ? (
                userProfile.data?.data ? (
                  <div className="flex flex-col gap-3 overflow-hidden sm:ml-4">
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Name</P>
                      <P className="text-lg font-semibold">
                        {userProfile.data.data.full_name}
                      </P>
                    </div>
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Username</P>
                      <P className="text-lg font-semibold">
                        {userProfile.data.data.user_name}
                      </P>
                    </div>
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">
                        Phone Number
                      </P>
                      <P className="text-lg font-semibold">
                        {userProfile.data.data.phone_number ?? '-'}
                      </P>
                    </div>
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Email</P>
                      <P className="text-lg font-semibold">
                        {userProfile.data.data.email}
                      </P>
                    </div>
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Gender</P>
                      <P className="text-lg font-semibold">
                        {userProfile.data.data.gender === 'M' ? (
                          <>Male</>
                        ) : (
                          <>Female</>
                        )}
                      </P>
                    </div>
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Birth Date</P>
                      <P className="text-lg font-semibold">
                        {moment(userProfile.data.data.birth_date).format(
                          'DD MMMM YYYY'
                        )}
                      </P>
                    </div>
                    <div className="mt-4">
                      <Button
                        outlined
                        buttonType="primary"
                        onClick={() => {
                          modal.edit({
                            title: 'Edit Profile',
                            content: (
                              <>
                                <FormEditProfile />
                              </>
                            ),
                            closeButton: false,
                          })
                        }}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>Handle no data!</>
                )
              ) : (
                <div className="ml-4 flex flex-col gap-3">
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-ping rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-ping rounded bg-base-200 text-lg"></P>
                  </div>
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-ping rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-ping rounded bg-base-200 text-lg"></P>
                  </div>
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-ping rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-ping rounded bg-base-200 text-lg"></P>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default ManageProfile
