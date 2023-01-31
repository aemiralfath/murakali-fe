import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa'

import { Icon, P } from '@/components'

const SocialMediaBtn: React.FC<{ icon: React.ReactNode; href: string }> = ({
  icon,
  href,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex aspect-square items-center justify-center rounded-full border-[1px] p-2 transition-all hover:bg-white hover:text-primary"
    >
      {icon}
    </a>
  )
}

const Footer = () => {
  return (
    <div className="relative mt-32 w-full rounded-t-xl text-white">
      <div className="flex w-full flex-col items-center gap-5 bg-primary p-8">
        <div className="max-w-[8rem]">
          <Icon />
        </div>
        <P className="max-w-[32rem] text-center text-sm">
          Murakali is an Indonesian e-commerce platform that offers a variety of
          original products, fast and free shipping, 24/7 customer service,
          secure transactions, a 15-day return policy, and cash on delivery.
        </P>
        <div className="flex gap-5">
          <SocialMediaBtn
            icon={<FaFacebookF />}
            href={'https://www.facebook.com'}
          />
          <SocialMediaBtn
            icon={<FaTwitter />}
            href={'https://www.twitter.com'}
          />
          <SocialMediaBtn
            icon={<FaLinkedinIn />}
            href={'https://www.linkedin.com'}
          />
          <SocialMediaBtn
            icon={<FaInstagram />}
            href={'https://www.instagram.com'}
          />
        </div>
      </div>
      <div className="w-full bg-secondary py-4 px-8 text-center text-xs">
        Copyright © 2022-2023. Made with ♥ by Murakali Team.
      </div>
    </div>
  )
}

export default Footer
