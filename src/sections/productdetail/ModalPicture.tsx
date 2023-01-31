import { Dialog, Transition } from '@headlessui/react'

import React, { Fragment, useEffect, useState } from 'react'

interface ModalPictureProps {
  isOpen: boolean

  productImage: string
  productTitle: string
  closeModal: () => void
}

const ModalPicture: React.FC<ModalPictureProps> = ({
  isOpen,
  productImage,
  productTitle,
  closeModal,
}) => {
  const [imageSize, setImageSize] = useState(700)
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 500) {
        setImageSize(700)
      } else {
        setImageSize(300)
      }
    })
  }, [])
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className=" h-full w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-xl transition-all">
                <div className="m-1 flex items-center justify-center ">
                  <img
                    width={imageSize}
                    height={imageSize}
                    alt={productTitle}
                    src={productImage}
                    loading="lazy"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = '/asset/no-image.png'
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalPicture
