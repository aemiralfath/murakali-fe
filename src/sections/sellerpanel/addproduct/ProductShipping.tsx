import { H3, H4, P } from '@/components'
import { useMediaQuery } from '@/hooks'
import { RadioGroup } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

const ProductShipping: React.FC<{
  hazardous: boolean
  setHazardous: (b: boolean) => void
}> = ({ hazardous, setHazardous }) => {
  const md = useMediaQuery('md')

  const [dg, setDg] = useState(hazardous ? 'yes' : 'no')
  useEffect(() => {
    setHazardous(dg === 'yes')
  }, [dg])

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <H3>Shipping</H3>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        {md ? (
          <div className="md:w-[30%]">
            <div className="flex items-center gap-3">
              <H4>Dangerous Goods</H4>
            </div>
            <P className="mt-2 max-w-[20rem] text-sm">
              Please fill in DG accurately. Inaccurate DG may result in
              additional shipping fee or failed delivery.
            </P>
          </div>
        ) : (
          <P className="label-text">Dangerous Goods</P>
        )}
        <RadioGroup
          value={dg}
          onChange={setDg}
          className="flex flex-wrap items-center gap-2"
          id="dangerous-good"
        >
          <RadioGroup.Option value="no">
            {({ checked }) => (
              <label className="label flex cursor-pointer gap-1">
                <input
                  type="radio"
                  name="radio-dg-no"
                  className="radio checked:bg-primary"
                  checked={checked}
                />
                <span className="label-text">No</span>
              </label>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="yes">
            {({ checked }) => (
              <label className="label flex cursor-pointer gap-1">
                <input
                  type="radio"
                  name="radio-dg-yes"
                  className="radio checked:bg-primary"
                  checked={checked}
                />
                <span className="label-text">
                  Contains Battery/Liquid/Magnet/Flammables
                </span>
              </label>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </div>
  )
}

export default ProductShipping
