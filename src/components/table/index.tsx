import React from 'react'

interface TableProps {
  data: Array<{
    [key: string]: React.ReactNode
  }>
  isLoading?: boolean
  clickableColumn?: Array<{
    colName: string
    component: React.ReactNode
  }>
}

const Table: React.FC<TableProps> = ({ data, isLoading, clickableColumn }) => {
  const columnNames = Object.keys(data[0])

  return (
    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border bg-gray-300">
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
                className={
                  isLoading
                    ? 'animate-pulse rounded-lg bg-slate-300 px-6 py-3 text-left text-transparent'
                    : 'px-6 py-3 text-left'
                }
              >
                <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                  <span>{column}</span>
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
        {data.map((entry, idx) => {
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
        })}
      </tbody>
    </table>
  )
}

export default Table
