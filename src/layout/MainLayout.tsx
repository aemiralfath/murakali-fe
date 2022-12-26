import React from 'react'
import { Navbar } from './template'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-screen relative overflow-hidden">
      <div className="absolute z-40 w-full">
        <Navbar />
      </div>
      <main className="container mx-auto min-h-screen px-5 pt-[5.5rem] sm:pt-[7rem]">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
