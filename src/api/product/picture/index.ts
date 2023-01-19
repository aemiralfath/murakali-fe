import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import { useMutation } from '@tanstack/react-query'

export const useUploadProductPicture = () => {
  return useMutation(async (photo?: File) => {
    const form = new FormData()
    if (photo) {
      form.append('Img', photo as File)
    }

    return await authorizedClient.post<APIResponse<string>>(
      '/product/picture',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  })
}
