import React from 'react'
import { BsFacebook, BsTwitter, BsLinkedin } from 'react-icons/bs'
import { HiLink } from 'react-icons/hi'

import { Divider, TextInput, Button } from '@/components'

const ShareModal = () => {
  // TODO: Change links
  return (
    <div className="flex flex-col gap-5">
      <div className={'flex justify-around gap-4'}>
        <a
          className="flex cursor-pointer items-center justify-center rounded-full border p-3 transition-all hover:bg-gray-50"
          href="https://www.facebook.com/"
          target={'_blank'}
          rel="noreferrer"
        >
          <BsFacebook />
        </a>
        <a
          className="flex cursor-pointer items-center justify-center rounded-full border p-3 transition-all hover:bg-gray-50"
          href="https://twitter.com/intent/tweet?text=Hello%20world"
          target={'_blank'}
          rel="noreferrer"
        >
          <BsTwitter />
        </a>
        <a
          className="flex cursor-pointer items-center justify-center rounded-full border p-3 transition-all hover:bg-gray-50"
          href="https://www.linkedin.com/"
          target={'_blank'}
          rel="noreferrer"
        >
          <BsLinkedin />
        </a>
      </div>
      <Divider />
      <div>
        <div className="font-bold">Or Copy This Link</div>
        <div className="mt-2 flex w-full items-center gap-3">
          <div className="w-full">
            <TextInput
              value={location.href}
              autoFocus={false}
              full
              className={'w-full flex-grow'}
            />
          </div>
          <Button
            buttonType="primary"
            outlined
            onClick={() => {
              void navigator.clipboard.writeText(location.href)
            }}
          >
            <HiLink /> Copy
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
