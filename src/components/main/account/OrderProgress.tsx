import { capitalizeOnlyFirstLetter } from '@/utils/helpers';
import React from 'react';
import { MdOutlineCheck } from 'react-icons/md';

const statuses = ['PENDING', 'INPROGRESS', 'SHIPPED', 'COMPLETED'];

const status: { [key: string]: number } = {
  PENDING: 0,
  INPROGRESS: 1,
  SHIPPED: 2,
  COMPLETED: 3,
};

function OrderProgress({ orderStatus }: { orderStatus: string }) {
  const currentStatusIndex = status[orderStatus];

  return (
    <div className="flex-[67%] px-4">
      <h5 className="text-lg font-semibold">Order Status</h5>
      <div className="flex h-full items-center">
        <div className="flex w-full items-center justify-center px-4">
          {statuses.map((status, index) => (
            <React.Fragment key={status + index}>
              <div className="relative flex flex-col items-center gap-4 font-semibold">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    index <= currentStatusIndex
                      ? 'bg-green-500'
                      : 'border border-green-100'
                  } `}
                >
                  <MdOutlineCheck className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-[-25px]">
                  {capitalizeOnlyFirstLetter(status)}
                </div>
              </div>
              <div
                className={`h-[2px] w-full bg-green-100 ${
                  statuses.length - 1 === index && 'hidden'
                } ${index < currentStatusIndex && 'bg-green-300'}`}
              ></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderProgress;
