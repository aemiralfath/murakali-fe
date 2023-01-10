import cx from '@/helper/cx'
import Image from 'next/image'
import React from 'react'
import { P } from '../typography'

interface TableProps {
  data: Array<{
    [key: string]: React.ReactNode
  }>
  isLoading?: boolean
  clickableColumn?: Array<{
    colName: string
    component: React.ReactNode
  }>
  empty?: boolean
  wide?: boolean
}

const Table: React.FC<TableProps> = ({
  data,
  isLoading,
  clickableColumn,
  empty,
  wide,
}) => {
  const columnNames = Object.keys(data[0])

  return (
    <table
      className={cx(
        'divide-y overflow-auto border',
        wide ? 'min-w-full' : 'w-fit'
      )}
    >
      <thead>
        <tr className="divide-x">
          {columnNames.map((column, idx) => {
            let foundIdx = -1
            if (clickableColumn) {
              foundIdx = clickableColumn.findIndex(
                (el) => el.colName === column
              )
            }
            return (
              <th
                key={idx}
                scope="col"
                className={'w-[9rem] px-6 py-3 text-left'}
              >
                <div className="flex w-[9rem] items-center justify-between gap-3 whitespace-nowrap">
                  {isLoading ? (
                    <div className="h-[1.25rem] w-[70%] animate-pulse rounded bg-base-300" />
                  ) : (
                    <span>{column}</span>
                  )}
                  {foundIdx !== -1 && clickableColumn ? (
                    clickableColumn[foundIdx].component
                  ) : (
                    <></>
                  )}
                </div>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {empty ? (
          <td
            className="whitespace-nowrap px-6 py-4 text-sm text-gray-800"
            colSpan={columnNames.length}
          >
            <div className="flex w-full flex-col items-center justify-center py-6">
              <Image
                src={'/asset/empty.svg'}
                alt={'No data'}
                height={300}
                width={200}
              />
              <P className="mt-6 italic text-gray-400">Data not found</P>
            </div>
          </td>
        ) : (
          data.map((entry, idx) => {
            return (
              <tr
                key={idx}
                className="divide-x transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-50 hover:even:bg-gray-100"
              >
                {columnNames.map((col, idxx) => {
                  return (
                    <td
                      key={idxx}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-800"
                    >
                      <span
                        className={
                          isLoading
                            ? 'animate-pulse rounded-lg bg-slate-300 text-transparent'
                            : ''
                        }
                      >
                        {entry[col]}
                      </span>
                    </td>
                  )
                })}
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}

export default Table
