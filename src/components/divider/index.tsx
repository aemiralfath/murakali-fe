import React from 'react'

const Divider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex w-full items-center">
      <div className="h-[1px] grow bg-gray-300" />
      {children ? (
        <>
          <div className="px-4 text-sm text-gray-300">{children}</div>
          <div className="h-[1px] grow bg-gray-300" />
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Divider
