import React from 'react';
import { useRead } from '@/hooks/useRead';
import { BigNumber } from 'ethers';
import { Bet } from './Bet';

function reverseArr(input: any) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

const Bets = ({ gameId, sport }: { gameId: number; sport: any }) => {
  const { data: bets, isLoading: isBetsLoading } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getGameBets',
    args: [gameId],
  });

  return (
    <div className="flex flex-col gap-2 mt-4">
      {isBetsLoading && (
        <div className="flex flex-col space-y-3">loading ...</div>
      )}

      <div className="flex flex-col gap-4">
        {!isBetsLoading && bets?.length === 0 && (
          <div className="alert alert-warning">
            <div className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <label>No picks yet.</label>
            </div>
          </div>
        )}
        {bets && bets.length > 0 && (
          <div className="p-2 lg:p-6 card bg-base-300 w-full">
            {reverseArr(bets).map((betId: BigNumber, index: number) => (
              <div key={index}>
                {index !== 0 && <div className="divider"></div>}
                <Bet sport={sport} key={betId.toNumber()} betId={betId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bets;
