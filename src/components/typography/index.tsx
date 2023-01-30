import cx from '@/helper/cx'
import React from 'react'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>
const H1: React.FC<HeadingProps> = ({ className, ...rest }) => {
  return (
    <h1
      className={cx(
        'font-heading text-3xl font-extrabold sm:text-4xl',
        className ?? ''
      )}
      {...rest}
    />
  )
}

const H2: React.FC<HeadingProps> = ({ className, ...rest }) => {
  return (
    <h2
      className={cx('font-heading text-2xl font-bold', className ?? '')}
      {...rest}
    />
  )
}

const H3: React.FC<HeadingProps> = ({ className, ...rest }) => {
  return (
    <h3
      className={cx('font-heading text-xl font-semibold', className ?? '')}
      {...rest}
    />
  )
}

const H4: React.FC<HeadingProps> = ({ className, ...rest }) => {
  return (
    <h4
      className={cx('font-heading font-semibold', className ?? '')}
      {...rest}
    />
  )
}

type PProps = React.HTMLAttributes<HTMLParagraphElement>
const P: React.FC<PProps> = ({ className, ...rest }) => {
  return <p className={cx('', className ?? '')} {...rest} />
}

interface AProps extends React.HTMLAttributes<HTMLAnchorElement> {
  underline?: boolean
}
const A: React.FC<AProps> = ({ underline, className, ...rest }) => {
  return (
    <a
      className={cx(
        'cursor-pointer transition-all hover:text-primary hover:underline',
        underline ? 'underline' : '',
        className ?? ''
      )}
      {...rest}
    />
  )
}

export { H1, H2, H3, H4, P, A }
