import { Button, TextInput } from '@/components'
import type { UserDetail } from '@/types/api/user'
import type { APIResponse } from '@/types/api/response'

import React, { useEffect, useState } from 'react'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import { useGetUserProfile, useEditUserProfile } from '@/api/user/profile'
import { toast } from 'react-hot-toast'

import moment from 'moment'
import type { AxiosError } from 'axios'

const FormEditProfile: React.FC = () => {
  const userProfile = useGetUserProfile()
  const editUserProfile = useEditUserProfile()
  useEffect(() => {
    if (editUserProfile.isSuccess) {
      toast.success('Successfully edit')

      void dispatch(closeModal())
      setInput({
        email: '',
        full_name: '',
        user_name: '',
        phone_number: '',
        birth_date: '',
        id: '',
        photo_url: '',
        gender: 'M',
      })
    }
  }, [editUserProfile.isSuccess])

  useEffect(() => {
    if (editUserProfile.isError) {
      const errmsg = editUserProfile.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [editUserProfile.isError])

  const [selected, setSelected] = useState<'M' | 'F'>('M')
  const dispatch = useDispatch()

  const [input, setInput] = useState<UserDetail>({
    email: '',
    full_name: '',
    user_name: '',
    phone_number: '',
    birth_date: '',
    id: '',
    photo_url: '',
    gender: 'M',
  })

  useEffect(() => {
    if (userProfile.data?.data) {
      setInput({
        email: userProfile.data.data.email,
        full_name: userProfile.data.data.full_name,
        user_name: userProfile.data.data.user_name,
        phone_number: userProfile.data.data.phone_number,
        birth_date: userProfile.data.data.birth_date,
        id: '',
        photo_url: '',
        gender: selected,
      })
      setSelected(userProfile.data.data.gender)
    }
  }, [userProfile.isLoading])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }
  const handleEditProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    editUserProfile.mutate(input)
  }

  return (
    <>
      <div className="px-6 py-6 lg:px-8">
        <form
          className="mt-1 flex flex-col gap-y-3"
          onSubmit={(e) => {
            void handleEditProfile(e)
            return false
          }}
        >
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <TextInput
              inputSize="md"
              type="text"
              name="full_name"
              placeholder="fullname"
              onChange={handleChange}
              value={input.full_name}
              full
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <TextInput
              type="text"
              name="user_name"
              placeholder="username"
              onChange={handleChange}
              value={input.user_name}
              full
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Phone Number
            </label>
            <TextInput
              type="number"
              name="phone_number"
              onChange={handleChange}
              placeholder="08xxxxxxxx"
              value={input.phone_number}
              full
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Birth Date
            </label>
            <TextInput
              type="date"
              name="birth_date"
              onChange={handleChange}
              max={moment(Date.now()).format('YYYY-MM-DD')}
              placeholder={String(Date.now())}
              value={moment(input.birth_date).format('YYYY-MM-DD')}
              full
              required
            />
          </div>

          <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            Gender
          </label>
          <div className="mx-5 flex flex-col gap-2">
            <div>
              <label>
                <input
                  onChange={() => {
                    setSelected('M')
                  }}
                  type="radio"
                  name="Male"
                  checked={selected === 'M'}
                />
                Male
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="Female"
                  checked={selected === 'F'}
                  onChange={() => {
                    setSelected('F')
                  }}
                />
                Women
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              buttonType="accent"
              onClick={() => {
                setInput({
                  email: '',
                  full_name: '',
                  user_name: '',
                  phone_number: '',
                  birth_date: '',
                  id: '',
                  photo_url: '',
                  gender: 'M',
                })
                dispatch(closeModal())
              }}
            >
              Cancel
            </Button>
            <Button type="submit" buttonType="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default FormEditProfile
