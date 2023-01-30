import { P } from '@/components'
import Head from 'next/head'
import Image from 'next/image'

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-base-200">
        <div className="relative h-[200px] w-[300px] sm:h-64 sm:w-96 md:h-[20rem] md:w-[30rem]">
          <Image
            src={'/asset/500.svg'}
            alt="404"
            fill
            className="object-cover"
          />
        </div>
        <P className="opacity-70">
          Sorry, things are a little unstable here...
        </P>
        <P className="opacity-70">Please come back later</P>
      </div>
    </>
  )
}
