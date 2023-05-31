import React, { useContext, useState } from 'react';
import { useRead } from '@/hooks/useRead';
import { BigNumber } from 'ethers';
import { UserContext } from '@/lib/UserContext';
import { Referral } from './Referral';
import { nba } from '@/lib/nba';
import { nhl } from '@/lib/nhl';

function reverseArr(input: any) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

const Referrals = ({ address }: { address: string }) => {
  const [user, _]: any = useContext(UserContext);
  const [sportTab, setSportTab] = useState('NHL');
  const { data: referrals, isLoading: isReferralsLoading } = useRead({
    contractName: 'Referrals',
    address,
    functionName: 'getMyReferrals',
    args: [user?.publicAddress],
  });
  const { data: mintCount } = useRead({
    contractName: 'Mojo',
    address: nhl?.mojoAddress,
    functionName: 'getMintCount',
    args: [user?.publicAddress],
  });

  return (
    <div className="flex flex-col gap-2 mt-4">
      {isReferralsLoading && (
        <div className="flex flex-col space-y-3">loading ...</div>
      )}
      {!isReferralsLoading && (
        <div className="tabs tabs-boxed mb-4 bg-transparent gap-2">
          <a
            onClick={() => setSportTab('NHL')}
            className={`tab border border-2 border-primary ${
              sportTab === 'NHL' && 'tab-active'
            }`}
          >
            NHL
          </a>
          <a
            onClick={() => setSportTab('NBA')}
            className={`tab border border-2 border-primary ${
              sportTab === 'NBA' && 'tab-active'
            }`}
          >
            NBA
          </a>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {!isReferralsLoading && referrals?.length === 0 && (
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
              <label>No referrals yet.</label>
            </div>
          </div>
        )}
        {referrals && referrals.length > 0 && (
          <div className="p-2 lg:p-6 card bg-base-300 w-full">
            {reverseArr(referrals).map(
              (referralId: BigNumber, index: number) => (
                <div key={index}>
                  {index !== 0 && <div className="divider"></div>}
                  <Referral
                    sport={sportTab === 'NHL' ? nhl : nba}
                    key={referralId.toNumber()}
                    referralId={referralId}
                    mintCount={mintCount.toNumber()}
                    index={index}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
