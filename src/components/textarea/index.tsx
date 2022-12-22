import cx from '@/helper/cx'
import React from 'react'

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  full?: boolean
  errorMsg?: string
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  full,
  errorMsg,
  ...rest
}) => {
  return (
    <div
      className={cx('form-control', full ? 'w-full' : '', rest.className ?? '')}
    >
      {label ? (
        <label className="py-0.5 px-1" htmlFor={rest.name}>
          <span className="label-text">{label}</span>
        </label>
      ) : (
        <></>
      )}
      <textarea
        className={cx(
          'textarea-bordered textarea',
          full ? 'w-full' : '',
          errorMsg ? 'textarea-error' : ''
        )}
        {...rest}
      />
      {errorMsg ? (
        <label className="py-0.5 px-1">
          <span className="label-text-alt text-error">{errorMsg}</span>
        </label>
      ) : (
        <></>
      )}
    </div>
  )
}

export default TextArea
