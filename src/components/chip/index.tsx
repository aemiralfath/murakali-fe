import React from 'react'

import cx from '@/helper/cx'

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  type?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'gray'
    | 'success'
    | 'error'
    | 'white'
}

const Chip: React.FC<ChipProps> = ({
  type = 'primary',
  className,
  ...rest
}) => {
  return (
    <div
      className={cx(
        className ?? '',
        'block max-w-fit truncate whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold uppercase ',
        type === 'primary'
          ? 'bg-primary text-white'
          : type === 'secondary'
          ? 'bg-secondary text-white'
          : type === 'accent'
          ? 'bg-accent text-white'
          : type === 'gray'
          ? 'bg-base-200 text-base-content'
          : type === 'white'
          ? 'bg-white text-base-content'
          : type === 'success'
          ? 'bg-success text-success-content'
          : 'bg-error text-error-content'
      )}
      {...rest}
    />
  )
}

export default Chip
