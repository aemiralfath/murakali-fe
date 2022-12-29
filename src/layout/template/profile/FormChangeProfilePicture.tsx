import { useEditProfilePicture } from '@/api/user/profile'
import { Button } from '@/components'
import { useDispatch } from '@/hooks'
import type { IUserUploadPhotoProfile } from '@/types/api/user'
import { closeModal } from '@/redux/reducer/modalReducer'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

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
  }

  useEffect(() => {
    if (editUserImageProfile.isSuccess) {
      toast.success('Profile Picture Updated!')
      dispatch(closeModal())
    }
  }, [editUserImageProfile.isSuccess])

  useEffect(() => {
    if (editUserImageProfile.isError) {
      toast.success('An error occured')
      dispatch(closeModal())
    }
  }, [editUserImageProfile.isError])

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
            <input
              name="photo_url"
              type="file"
              className="file-input"
              accept="image/png, image/jpeg"
              placeholder="Photo"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              outlined
              buttonType="primary"
              isLoading={editUserImageProfile.isLoading}
              onClick={() => {
                setInput({
                  photo_url: undefined,
                })
                dispatch(closeModal())
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              buttonType="primary"
              isLoading={editUserImageProfile.isLoading}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default FormChangeProfilePicture
