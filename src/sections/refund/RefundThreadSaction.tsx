import { Avatar, Chip, Divider, H2, H4, P } from '@/components'
import type { ConversationRefundThread, RefundThread } from '@/types/api/refund'

import moment from 'moment'

const RefundThreadConversation: React.FC<{
  refundThreads: RefundThread[]
}> = ({ refundThreads }) => {
  return (
    <div className="flex flex-col gap-3">
      {refundThreads.map((thread, index) => {
        return (
          <div key={index}>
            {thread.is_buyer ? (
              <div className="flex h-full flex-col rounded border bg-slate-100 px-4 py-2">
                <div className="flex">
                  <div className="min-h-[5rem] w-[20%] min-w-[20%] border-r-4 border-blue-500">
                    <div className="flex gap-3">
                      <div className="rounded-full">
                        <Avatar url={thread.photo_url} size="lg" />
                      </div>
                      <div className="flex-row">
                        <H4>{thread.user_name}</H4>
                        <Chip type="primary">buyer</Chip>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 max-w-full flex-col p-3">
                    <div className="max-h-full min-h-[4rem] align-top">
                      {thread.text}
                    </div>
                    <div className="mt-3 align-bottom text-[0.76rem]">
                      {moment(
                        moment(thread.created_at)
                          .utcOffset(420)
                          .format('YYYYMMDDHHmmss')
                          .toString(),
                        'YYYYMMDDHHmmss'
                      ).fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            ) : thread.is_seller ? (
              <div className="flex h-full flex-col rounded border bg-slate-200 px-4 py-2">
                <div className="flex">
                  <div className="min-h-[5rem] w-[20%] min-w-[20%] border-r-4 border-green-500">
                    <div className="flex gap-3">
                      <div className="rounded-full">
                        <Avatar url={thread.photo_url} size="lg" />
                      </div>
                      <div className="flex-row">
                        <H4>{thread.shop_name}</H4>
                        <Chip type="success">Seller</Chip>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 max-w-full flex-col p-3">
                    <div className="max-h-full min-h-[4rem] align-top">
                      {thread.text}
                    </div>
                    <div className="mt-3 align-bottom text-[0.76rem]">
                      {moment(
                        moment(thread.created_at)
                          .utcOffset(420)
                          .format('YYYYMMDDHHmmss')
                          .toString(),
                        'YYYYMMDDHHmmss'
                      ).fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )
      })}
    </div>
  )
}

const RefundThreadSaction: React.FC<{
  refundThreadData: ConversationRefundThread
}> = ({ refundThreadData }) => {
  return (
    <div>
      <div className="mt-5 flex flex-col gap-3 rounded border bg-white p-4">
        <div className="flex justify-between gap-3">
          <div className="w-[20%] min-w-[20%]">
            <div className="flex h-full gap-3 align-top">
              <div>
                <Avatar url={refundThreadData.photo_url} size="lg" />
              </div>
              <div>
                <H4>{refundThreadData.user_name}</H4>
              </div>
            </div>
          </div>
          <div className="w-[80%] rounded border bg-white p-4">
            <div className="-z-0 flex-1">
              <div className="flex justify-between">
                <div>
                  <H2 className="mb-2">Reason to Refund</H2>
                </div>
                {refundThreadData.refund_data.rejected_at.Valid ? (
                  <div className="">
                    <div className="flex items-end justify-end">
                      <Chip type="error">Rejected</Chip>
                    </div>
                    <P className="text-[0.85rem]">
                      {moment(refundThreadData.refund_data.rejected_at.Time)
                        .utcOffset(420)
                        .format('DD MMMM YYYY HH:mm:ss')
                        .toString()}
                    </P>
                  </div>
                ) : refundThreadData.refund_data.accepted_at.Valid ? (
                  <>
                    {refundThreadData.refund_data.refunded_at.Valid ? (
                      <div>
                        <div className="flex items-end justify-end">
                          <Chip type="primary">Refunded</Chip>
                        </div>
                        <P className="text-[0.85rem]">
                          {moment(refundThreadData.refund_data.refunded_at.Time)
                            .utcOffset(420)
                            .format('DD MMMM YYYY HH:mm:ss')
                            .toString()}
                        </P>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end justify-end">
                          <Chip type="success">Accepted</Chip>
                        </div>

                        <P className="text-[0.85rem]">
                          {moment(refundThreadData.refund_data.accepted_at.Time)
                            .utcOffset(420)
                            .format('DD MMMM YYYY HH:mm:ss')
                            .toString()}
                        </P>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <Chip type="gray">In Progress</Chip>
                  </div>
                )}
              </div>
              <div className="py-3">
                <img
                  alt={'image'}
                  src={refundThreadData.refund_data.image}
                  width={150}
                  height={150}
                />
              </div>
              <Divider />
              <div className="max-w-full break-words py-2">
                {refundThreadData.refund_data.reason}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RefundThreadConversation
        refundThreads={refundThreadData.refund_threads}
      />
    </div>
  )
}

export default RefundThreadSaction
