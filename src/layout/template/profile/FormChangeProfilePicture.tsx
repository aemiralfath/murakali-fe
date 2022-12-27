import { useEditProfilePicture } from '@/api/user/profile'
import { Button, TextInput } from '@/components'
import { useDispatch } from '@/hooks'
import type { IUserUploadPhotoProfile } from '@/types/api/user'
import { closeModal } from '@/redux/reducer/modalReducer'
import React, { useState } from 'react'

function FormChangeProfilePicture() {
  const dispatch = useDispatch()
  const editUserImageProfile = useEditProfilePicture()

  const [input, setInput] = useState<IUserUploadPhotoProfile>({
    photo_url: undefined,
  })

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    const inputName = event.currentTarget.name

    if (event.currentTarget.files !== null) {
      const picture = event.currentTarget.files[0]
      setInput((prev) => ({ ...prev, [inputName]: picture }))
    }
  }

  const handleEditProfilePicture = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    editUserImageProfile.mutate(input.photo_url)

    void dispatch(closeModal())
  }
  return (
    <>
      <div className="px-6 py-6 lg:px-8">
        <form
          className="mt-1 flex flex-col gap-y-3"
          onSubmit={(e) => {
            void handleEditProfilePicture(e)
            return false
          }}
        >
          <div>
            <label className=" block text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <TextInput
              inputSize="md"
              type="file"
              name="photo_url"
              accept="image/png, image/jpeg"
              placeholder="Photo"
              onChange={handleChange}
              full
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              buttonType="accent"
              onClick={() => {
                setInput({
                  photo_url: undefined,
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

export default FormChangeProfilePicture
