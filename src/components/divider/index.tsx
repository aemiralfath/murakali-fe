import React from 'react'

const Divider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex w-full items-center">
      <div className="h-[1px] grow bg-[#E5E7EB]" />
      {children ? (
        <>
          <div className="px-4 text-sm text-[#E5E7EB]">{children}</div>
          <div className="h-[1px] grow bg-[#E5E7EB]" />
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Divider
