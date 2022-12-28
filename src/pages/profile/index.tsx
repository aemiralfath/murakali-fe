import { Avatar, Button, P } from '@/components'
import ProfileMenu from '@/layout/template/profile/ProfileMenu'
import { useGetUserProfile } from '@/api/user/profile'

import moment from 'moment'

import { useModal } from '@/hooks'
import React from 'react'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
import FormEditProfile from '@/layout/template/profile/FormEditProfile'
import FormChangeProfilePicture from '@/layout/template/profile/FormChangeProfilePicture'

// import FormEditProfile from './FormEditProfile'

// import FormChangeProfilePicture from './FormChangeProfilePicture'

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
      <MainLayout>
        <div className="grid grid-cols-1 gap-x-0 gap-y-2 md:grid-cols-4 md:gap-x-2">
          <ProfileMenu selectedPage="profile" />
          <div className="border-1 col-span-3 h-full rounded-lg border-solid border-slate-600 p-8 shadow-2xl">
            <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <Avatar size="lg" url={userProfile.data?.data?.photo_url} />
                </div>

                <Button
                  buttonType="primary"
                  onClick={() => {
                    modal.edit({
                      title: 'Change Profile Picture Profile',
                      content: (
                        <>
                          <FormChangeProfilePicture />
                        </>
                      ),
                      closeButton: false,
                    })
                  }}
                >
                  Edit Profile Picture
                </Button>
                <Button
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

              <div className="col-span-2 flex flex-col gap-y-2 ">
                {!userProfile.isLoading ? (
                  userProfile.data?.data ? (
                    <div>
                      <div className=" m-3  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Name</P>
                        <P>: {userProfile.data.data.full_name}</P>
                      </div>
                      <div className=" m-3  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Username</P>
                        <P>: {userProfile.data.data.user_name}</P>
                      </div>
                      <div className=" m-3  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Phone Number</P>
                        <P>: {userProfile.data.data.phone_number}</P>
                      </div>
                      <div className=" m-3  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Email</P>
                        <P>: {userProfile.data.data.email}</P>
                      </div>
                      <div className=" m-3  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Gender</P>
                        <P>
                          :{' '}
                          {userProfile.data.data.gender === 'M' ? (
                            <>Male</>
                          ) : (
                            <>Female</>
                          )}
                        </P>
                      </div>
                      <div className=" m-2  grid grid-cols-1 gap-2 md:grid-cols-2 ">
                        <P>Birth Date</P>
                        <P>
                          :
                          {
                            // TODO: Create Helper
                            moment(userProfile.data.data.birth_date).format(
                              'DD MMMM YYYY'
                            )
                          }
                        </P>
                      </div>
                    </div>
                  ) : (
                    <>Handle no data!</>
                  )
                ) : (
                  // TODO: Handle Data
                  <>
                    <P>Loading</P>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ManageProfile
