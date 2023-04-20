import React from 'react';
import { useBetsRead } from '@/hooks/useBetsRead';
import { BigNumber } from 'ethers';
import { Bet } from './Bet';

function reverseArr(input: any) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

const Bets = ({ gameId }: { gameId: number }) => {
  const { data: bets, isLoading: isBetsLoading } = useBetsRead({
    functionName: 'getGameBets',
    args: [gameId],
  });

  return (
    <div className="flex flex-col gap-2">
      {isBetsLoading && (
        <div className="flex flex-col space-y-3">loading ...</div>
      )}
      {!isBetsLoading && bets?.length === 0 && (
        <div className="flex flex-col space-y-3">no bets yet</div>
      )}
      <div className="flex flex-col gap-4 mt-4">
        {bets &&
          reverseArr(bets).map((betId: BigNumber) => (
            <Bet key={betId.toNumber()} betId={betId} />
          ))}
      </div>
    </div>
  );
};

export default Bets;
