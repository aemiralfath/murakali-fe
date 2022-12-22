import cx from '@/helper/cx'
import { useDispatch, useSelector } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { HiCheck, HiInformationCircle, HiPencil, HiX } from 'react-icons/hi'
import Button from '../button'

const Modal: React.FC = () => {
  const modalTitleIconBase =
    'flex h-8 w-8 items-center justify-center rounded-full'

  const modalState = useSelector((state) => state.modal)
  const dispatch = useDispatch()

  function handleClose() {
    dispatch(closeModal())
  }

  return (
    <>
      <Transition appear show={modalState.isOpen} as={Fragment}>
        <Dialog as="div" className={'relative z-10'} onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={'fixed inset-0 bg-neutral-focus bg-opacity-25'} />
          </Transition.Child>

          <div className={'fixed inset-0 overflow-y-auto'}>
            <div
              className={
                'flex min-h-full items-center justify-center p-4 text-center'
              }
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={
                    'w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow transition-all'
                  }
                >
                  <Dialog.Title
                    as="h3"
                    className={
                      'flex items-center gap-2 px-6 pt-6 font-heading text-lg font-bold leading-6'
                    }
                  >
                    {modalState.status === 'error' ? (
                      <div
                        className={cx(
                          modalTitleIconBase,
                          'bg-error bg-opacity-5 text-error'
                        )}
                      >
                        <HiX />
                      </div>
                    ) : modalState.status === 'success' ? (
                      <div
                        className={cx(
                          modalTitleIconBase,
                          'bg-success bg-opacity-5 text-success'
                        )}
                      >
                        <HiCheck />
                      </div>
                    ) : modalState.status === 'edit' ? (
                      <div
                        className={cx(
                          modalTitleIconBase,
                          'bg-secondary bg-opacity-5 text-secondary'
                        )}
                      >
                        <HiPencil />
                      </div>
                    ) : (
                      <div
                        className={cx(
                          modalTitleIconBase,
                          'bg-primary bg-opacity-5 text-primary'
                        )}
                      >
                        <HiInformationCircle />
                      </div>
                    )}
                    <span>{modalState.title}</span>
                  </Dialog.Title>
                  <div className={'mt-2 p-6'}>
                    <div>{modalState.content}</div>
                  </div>

                  {modalState.closeButton ? (
                    <div
                      className={
                        'mt-4 flex justify-center gap-3 bg-gray-100 p-6'
                      }
                    >
                      <Button onClick={handleClose}>Close</Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal
