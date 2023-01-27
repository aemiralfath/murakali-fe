import { useDeleteCart, useGetCart } from '@/api/user/cart'
import { Button, H2, H4, P } from '@/components'
import ProductCart from '@/components/card/ProductCart'
import { useModal, useUser } from '@/hooks'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import { closeModal } from '@/redux/reducer/modalReducer'
import SummaryCart from '@/sections/cart/SummaryCart'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
function Cart() {
  const { user, isLoading } = useUser()
  const cartList = useGetCart()
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [selectedProducts, setSelectedProduct] = useState<string[]>([])
  const [selectedShop, setSelectedShop] = useState<string[]>([])
  const deleteCart = useDeleteCart()
  const modal = useModal()
  const dispatch = useDispatch()

  useEffect(() => {
    if (deleteCart.isSuccess) {
      toast.success('Successfully delete all carts')
      dispatch(closeModal())
    }
  }, [deleteCart.isSuccess])

  useEffect(() => {
    if (deleteCart.isError) {
      const errmsg = deleteCart.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteCart.isError])

  useEffect(() => {
    if (!isLoading && !(user ? true : false)) {
      Router.push('/login')
    }
  }, [user, isLoading])

  useEffect(() => {
    let countQuantity = 0
    if (cartList.data?.data?.rows) {
      cartList.data.data.rows.forEach(function (shop) {
        shop.product_details.forEach(function () {
          countQuantity = countQuantity + 1
        })
      })
    }
    if (
      selectedProducts.length === countQuantity &&
      selectedProducts.length !== 0
    ) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  }, [selectedProducts.length])

  return (
    <>
      <Navbar />
      <title>Cart</title>
      <TitlePageExtend title="Cart" />

      <div className="container my-8 mx-auto mb-10 h-fit min-h-screen w-full px-2">
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-4">
          <div className="col-span-3  flex flex-col gap-5">
            <div className="flex justify-between rounded-lg border-[1px] border-solid border-gray-300 py-5 px-8">
              <label className="flex-start flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkAll}
                  className="checkbox-primary checkbox"
                  onChange={() => {
                    if (cartList.data?.data?.rows) {
                      if (!checkAll) {
                        const resultProduct: string[] = []
                        const resultShop: string[] = []
                        cartList.data.data.rows.forEach(function (shop) {
                          shop.product_details.forEach(function (
                            productDetail
                          ) {
                            resultProduct.push(productDetail.id)
                          })
                          resultShop.push(shop.shop.id)
                        })

                        setSelectedProduct(resultProduct)
                        setSelectedShop(resultShop)
                        setCheckAll(true)
                      } else {
                        setSelectedProduct([])
                        setSelectedShop([])
                        setCheckAll(false)
                      }
                    }
                  }}
                />
                <H4>Choose All</H4>
              </label>
              <Button
                buttonType="ghost"
                onClick={() => {
                  modal.edit({
                    title: 'Delete All Cart',
                    content: (
                      <>
                        <P>Do you really want to delete all cart?</P>
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            type="button"
                            buttonType="primary"
                            onClick={() => {
                              dispatch(closeModal())
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            buttonType="gray"
                            onClick={() => {
                              if (cartList.data?.data) {
                                cartList.data.data.rows.forEach(function (sh) {
                                  for (
                                    let y = 0;
                                    y < sh.product_details.length;
                                    y++
                                  ) {
                                    deleteCart.mutate(sh.product_details[y].id)
                                  }
                                })
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    ),
                    closeButton: false,
                  })
                }}
              >
                Delete All
              </Button>
            </div>
            {!cartList.isLoading ? (
              <>
                {cartList.data?.data.rows ? (
                  cartList.data.data.rows.map((cart, index) => (
                    <div
                      className="z-10 h-full rounded-lg border-[1px] border-solid border-gray-300 py-7 px-8"
                      key={`${cart.id} ${index}`}
                    >
                      <label className="flex-start mb-5 flex items-center gap-2">
                        <input
                          className="checkbox-primary checkbox "
                          type="checkbox"
                          checked={
                            selectedShop.findIndex((data) => {
                              return data === cart.shop.id
                            }) !== -1
                          }
                          onClick={() => {
                            let resultProduct: string[] = []
                            let resultShop: string[] = []
                            const value = cart.shop.id

                            cart.product_details.forEach(function (pd) {
                              resultProduct = selectedProducts.filter(
                                (productId) => {
                                  return productId !== pd.id
                                }
                              )
                            })

                            resultShop = selectedShop.filter((ss) => {
                              return cart.shop.id !== ss
                            })

                            // unselect shop checkbox
                            for (let i = 0; i < selectedShop.length; i++) {
                              if (selectedShop[i] === value) {
                                cart.product_details.forEach(function (pd) {
                                  for (
                                    let j = 0;
                                    j < resultProduct.length;
                                    j++
                                  ) {
                                    if (pd.id === resultProduct[j]) {
                                      resultProduct.splice(j, 1)
                                    }
                                  }
                                })

                                setSelectedProduct(resultProduct)
                                setSelectedShop(resultShop)
                                return
                              }
                            }

                            // select shop checkbox
                            cart.product_details.forEach(function (pd) {
                              resultProduct.push(pd.id)
                            })
                            setSelectedProduct(resultProduct)

                            resultShop.push(cart.shop.id)
                            setSelectedShop(resultShop)
                          }}
                        />
                        <H2>{cart.shop.name}</H2>
                      </label>
                      {cart.product_details.map((product, index) => (
                        <div
                          className="flex flex-col gap-5"
                          key={`${index} ${product.id}`}
                        >
                          <ProductCart
                            forCart={true}
                            listProduct={product}
                            checked={
                              selectedProducts.findIndex((data) => {
                                return data === product.id
                              }) !== -1
                            }
                            onClick={() => {
                              const value = product.id
                              let resultShop: string[] = []

                              // select product checkbox
                              resultShop = selectedShop.filter((sp) => {
                                return cart.shop.id !== sp
                              })

                              // unselect product checkbox
                              for (
                                let i = 0;
                                i < selectedProducts.length;
                                i++
                              ) {
                                if (selectedProducts[i] === value) {
                                  const result: string[] =
                                    selectedProducts.filter((productId) => {
                                      return productId !== value
                                    })
                                  setSelectedProduct(result)

                                  let unCheck = false
                                  result.forEach(function (p) {
                                    cart.product_details.forEach(function (c) {
                                      if (p === c.id) {
                                        unCheck = true
                                      }
                                    })
                                  })
                                  if (!unCheck) {
                                    setSelectedShop(resultShop)
                                  }

                                  return
                                }
                              }

                              const newArray: string[] = []
                              selectedProducts.forEach(function (sp) {
                                newArray.push(sp)
                              })
                              newArray.push(value)
                              setSelectedProduct(newArray)

                              resultShop.push(cart.shop.id)
                              setSelectedShop(resultShop)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </>
            ) : (
              <P className="flex w-full justify-center">Loading</P>
            )}

            {cartList.data?.data?.total_pages === 0 ? (
              <div className="z-10 flex h-full items-center rounded-lg border-[1px] border-solid border-gray-300 py-7 px-8">
                <P className="flex w-full items-center justify-center font-extrabold">
                  Cart is Empty!
                </P>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <SummaryCart idProducts={selectedProducts} idShops={selectedShop} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Cart
