import React from 'react'
import { Toaster } from 'react-hot-toast'

const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={4}
      containerClassName="rounded"
      containerStyle={{}}
      toastOptions={{
        className: 'rounded text-lg',
        duration: 5000,
      }}
    />
  )
}

export default CustomToaster
