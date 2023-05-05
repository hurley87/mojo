import React from 'react';
import { useDerbyRead } from '@/hooks/useDerbyRead';
import { DerbyBet } from './DerbyBet';
import { makeNum } from '@/lib/number-utils';

function reverseArr(input: any) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

const DerbyBets = () => {
  const { data: bets, isLoading: isBetsLoading } = useDerbyRead({
    functionName: 'getAllBets',
    args: [],
  });

  const { data: totalBets } = useDerbyRead({
    functionName: 'totalBets',
    args: [],
  });

  return (
    <div className="flex flex-col gap-2 mt-4">
      {isBetsLoading && (
        <div className="flex flex-col space-y-3">loading ...</div>
      )}

      <div className="flex flex-col gap-4">
        {bets && bets.length > 0 && (
          <div className="p-2 lg:p-6 card bg-base-300 w-full">
            <div className="flex pb-8 justify-between w-full font-bold text-sm lg:text-lg">
              <p>
                {bets.length} bets | {makeNum(totalBets)} ETH
              </p>
              <p>Potential Payout</p>
            </div>
            {reverseArr(bets).map((bet, index: number) => (
              <div key={index}>
                {index !== 0 && <div className="divider"></div>}
                <DerbyBet bet={bet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DerbyBets;
