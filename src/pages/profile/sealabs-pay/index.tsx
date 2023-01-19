import { useGetUserSLP } from '@/api/user/slp'
import { Button, Chip, Divider, H1, H2, H3, P } from '@/components'
import ProfileLayout from '@/layout/ProfileLayout'
import Head from 'next/head'
import React from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'

function SealabsPay() {
  const sealabspay = useGetUserSLP()

  return (
    <>
      <Head>
        <title>Sealabs-Pay | Murakali</title>
        <meta
          name="description"
          content="Sealabs-Pay | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="sealabs-pay">
        <>
          <div className="flex justify-between">
            <H1 className="text-primary">Manage Sealabs-Pay</H1>
          </div>
          <div className="my-4">
            <Divider />
            {sealabspay.isSuccess &&
              sealabspay.data.data.map((slp, index) => (
                <div className="my-2 rounded border-[1px] p-2" key={index}>
                  <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-y-2 ">
                      <H2>{slp.name}</H2>
                      <H3>{slp.card_number}</H3>
                      <P>Expired At : {slp.active_date}</P>
                      {slp.is_default ? (
                        <div className="flex flex-wrap gap-2">
                          <Chip>Default</Chip>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className=" flex flex-col justify-center gap-4">
                      <Button buttonType="primary">
                        <HiPencil /> Set Default
                      </Button>
                      <Button buttonType="primary" outlined>
                        <HiTrash /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default SealabsPay
