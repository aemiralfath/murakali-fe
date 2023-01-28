import React from 'react'
import { Navbar } from './template'
import Footer from './template/footer'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-screen relative min-h-screen overflow-hidden">
      <div className="absolute z-20 w-full">
        <Navbar />
      </div>
      <main className="container relative mx-auto flex min-h-[80vh] flex-col gap-6 px-5 pt-[5.5rem] sm:pt-[7rem]">
        {children}
      </main>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
