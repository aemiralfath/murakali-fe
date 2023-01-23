import { Button, P } from '@/components'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { HiArrowLeft } from 'react-icons/hi'

export default function Custom404() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-base-200">
        <div className="relative h-[200px] w-[300px] sm:h-64 sm:w-96 md:h-[20rem] md:w-[30rem]">
          <Image
            src={'/asset/404.svg'}
            alt="404"
            fill
            className="object-cover"
          />
        </div>
        <P className="opacity-70">
          Sorry, the page you are looking for could not be found
        </P>
        <Button
          className="mt-6"
          buttonType="primary"
          outlined
          size={'sm'}
          onClick={() => {
            router.push('/')
          }}
        >
          <HiArrowLeft /> Go Home
        </Button>
      </div>
    </>
  )
}
