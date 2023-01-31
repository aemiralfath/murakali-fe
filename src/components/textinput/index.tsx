import cx from '@/helper/cx'
import React, { useState } from 'react'
import { HiCheck, HiEye, HiEyeOff, HiX } from 'react-icons/hi'
import Spinner from '../spinner'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  full?: boolean
  fit?: boolean
  errorMsg?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  state?: 'success' | 'error' | 'loading'
  inputSize?: 'xs' | 'sm' | 'md' | 'lg'
  transparent?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  full,
  fit,
  errorMsg,
  leftIcon,
  rightIcon,
  state,
  inputSize = 'md',
  transparent,
  type,
  className,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className={cx(
        'form-control relative h-fit',
        full ? 'w-full' : '',
        fit ? 'max-w-full' : '',
        className ?? ''
      )}
    >
      {label ? (
        <label className="py-0.5 px-1" htmlFor={rest.name}>
          <span className="label-text">{label}</span>
          {rest.required ? (
            <span className="label-text font-semibold text-error">*</span>
          ) : (
            <></>
          )}
        </label>
      ) : (
        <></>
      )}
      <div
        className={cx(
          'flex gap-2',
          full ? 'w-full' : '',
          fit ? 'max-w-full' : ''
        )}
      >
        <input
          className={cx(
            transparent
              ? 'input-bordered input border-white bg-transparent text-white placeholder:text-white'
              : 'input-bordered input',
            full ? 'w-full' : '',
            fit ? 'max-w-full' : '',
            errorMsg ? 'input-error' : '',
            inputSize === 'xs'
              ? 'input-xs'
              : inputSize === 'sm'
              ? 'input-sm'
              : inputSize === 'lg'
              ? 'input-lg'
              : 'input-md',
            leftIcon ? 'pl-10' : ''
          )}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          {...rest}
        />
      </div>
      {leftIcon ? (
        <div
          className={cx(
            'pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 transform',
            label ? 'pt-[1.65rem]' : '',
            errorMsg ? 'pb-[1.65rem]' : ''
          )}
        >
          {leftIcon}
        </div>
      ) : (
        <></>
      )}

      {rightIcon ? (
        <div
          className={cx(
            'pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform',
            label ? 'pt-[1.65rem]' : '',
            errorMsg ? 'pb-[1.65rem]' : ''
          )}
        >
          {rightIcon}
        </div>
      ) : (
        <></>
      )}
      {type === 'password' || state ? (
        <div
          className={cx(
            'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform justify-end',
            label ? 'pt-[1.65rem]' : '',
            errorMsg ? 'pb-[1.65rem]' : ''
          )}
        >
          {type === 'password' ? (
            showPassword ? (
              <HiEyeOff
                className="pointer-events-auto cursor-pointer text-gray-400 transition-all hover:text-gray-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <HiEye
                className="pointer-events-auto cursor-pointer text-gray-400 transition-all hover:text-gray-500"
                onClick={() => setShowPassword(true)}
              />
            )
          ) : state === 'success' ? (
            <HiCheck className="text-success" />
          ) : state === 'error' ? (
            <HiX className="text-error" />
          ) : state === 'loading' ? (
            <Spinner color="gray" />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {errorMsg ? (
        <label className="py-0.5 px-1">
          <span className="label-text text-error">{errorMsg}</span>
        </label>
      ) : (
        <></>
      )}
    </div>
  )
}

export default TextInput
