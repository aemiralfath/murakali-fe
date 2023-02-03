import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { useGetUserProfile, useEditUserProfile } from '@/api/user/profile'
import { Button, TextInput } from '@/components'
import { useDispatch } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { UserDetail } from '@/types/api/user'

import type { AxiosError } from 'axios'
import moment from 'moment'

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
        role: 1,
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
    role: 1,
  })

  useEffect(() => {
    if (userProfile.data?.data) {
      let tempBirthDate: string = userProfile.data.data.birth_date
      if (userProfile.data.data.birth_date === '0001-01-01T00:00:00Z') {
        tempBirthDate = '1990-01-01T00:00:00Z'
      }
      setInput({
        email: userProfile.data.data.email,
        full_name: userProfile.data.data.full_name,
        user_name: userProfile.data.data.user_name,
        phone_number: userProfile.data.data.phone_number,
        birth_date: tempBirthDate,
        id: '',
        photo_url: '',
        gender: selected,
        role: 1,
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

    editUserProfile.mutate({
      email: input.email,
      full_name: input.full_name,
      user_name: input.user_name,
      phone_number: input.phone_number,
      birth_date: input.birth_date,
      id: '',
      photo_url: '',
      gender: selected,
      role: 1,
    })
  }

  //TODO: Still buggy, fix later
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
            <TextInput
              label={'Full Name'}
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
            <TextInput
              label="Username"
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
            <TextInput
              label="Phone Number"
              type="number"
              name="phone_number"
              leftIcon={'+62'}
              onChange={handleChange}
              placeholder="8xxxxxxxx"
              value={input.phone_number}
              full
              required
            />
          </div>

          <div>
            <TextInput
              label="Birth Date"
              type="date"
              name="birth_date"
              onChange={handleChange}
              max={moment(
                new Date(new Date().setDate(new Date().getDate() - 1))
              ).format('YYYY-MM-DD')}
              placeholder={String(Date.now())}
              value={moment(input.birth_date).format('YYYY-MM-DD')}
              full
              required
            />
          </div>

          <label className="label-text ml-1 block">Gender</label>
          <div className="mx-5 flex flex-col gap-2">
            <div>
              <label className="flex items-center gap-1">
                <input
                  onChange={() => {
                    setSelected('M')
                  }}
                  className={'radio-primary radio radio-xs'}
                  type="radio"
                  name="Male"
                  checked={selected === 'M'}
                />
                Male
              </label>
            </div>
            <div>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="Female"
                  className={'radio-primary radio radio-xs'}
                  checked={selected === 'F'}
                  onChange={() => {
                    setSelected('F')
                  }}
                />
                Female
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              outlined
              buttonType="primary"
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
                  role: 1,
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
