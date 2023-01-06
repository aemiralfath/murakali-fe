import cx from '@/helper/cx'
import React, { useEffect } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi'

type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  maxValue?: number
  setValue: (n: number) => void
}

const NumberInput: React.FC<NumberInputProps> = ({
  maxValue = 9999999,
  setValue,
  onChange,
  value,
  className,
  ...rest
}) => {
  useEffect(() => {
    if (value >= maxValue) {
      setValue(maxValue)
    }
  }, [maxValue])

  return (
    <div className="flex gap-1">
      <button
        className="btn-ghost btn-sm btn aspect-square rounded-full p-0"
        onClick={() => {
          if (typeof value === 'number') {
            if (value > 1) {
              setValue(value - 1)
            }
          }
        }}
      >
        <HiMinus />
      </button>
      <input
        className={cx(
          className ?? '',
          'input-bordered input input-sm max-w-[3rem] text-center'
        )}
        value={value}
        type={'number'}
        min={0}
        max={maxValue ?? rest.max}
        onChange={(e) => {
          setValue(parseInt(e.target.value))
          if (onChange) {
            onChange(e)
          }
        }}
        {...rest}
      />
      <button
        className="btn-ghost btn-sm btn aspect-square rounded-full p-0"
        onClick={() => {
          if (typeof value === 'number') {
            if (value < maxValue) {
              setValue(value + 1)
            }
          }
        }}
      >
        <HiPlus />
      </button>
    </div>
  )
}

export default NumberInput
