import { Button } from '@/components'
import { getCookies } from 'cookies-next'
import { type NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  const cookies = getCookies()

  return (
    <>
      <Head>
        <title>Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>ABC</div>
        <Button
          onClick={() => {
            console.log(cookies)
          }}
        >
          Click Me
        </Button>
      </main>
    </>
  )
}

export default Home
