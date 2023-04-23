import { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { makeNum } from '@/lib/number-utils';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { UserContext } from '@/lib/UserContext';
import { CancelBet } from './BetCancel';
import { BetAccept } from './BetAccept';
import { BetAccepted } from './BetAccepted';
import { BetCancelled } from './BetCancelled';
import { BetFinished } from './BetFinished';

const BET_STATE = ['Created', 'Accepted', 'Finished', 'Cancelled'];

export const Bet = ({ betId }: { betId: BigNumber }) => {
  const [user, _]: any = useContext(UserContext);
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    functionName: 'getBet',
    args: [betId],
  });
  const [betState, setBetState] = useState(BET_STATE[0]);
  const [betValue, setBetValue] = useState('1.0');
  const { data: profile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [bet?.teamPickedId],
  });
  const myBet =
    user?.publicAddress?.toLowerCase() === bet?.creator?.toLowerCase();

  useEffect(() => {
    if (bet?.state) setBetState(BET_STATE[bet?.state]);
    if (bet?.odds)
      setBetValue(
        (Number(bet?.amount.mul(100).div(bet?.odds)) / 100).toString()
      );
  }, [bet?.state, bet?.odds, bet?.amount]);

  return user?.loading ? (
    <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
  ) : (
    <div className={`flex`}>
      <div className="divider"></div>
      {isBetLoading && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isBetLoading && bet && (
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-0">
            <p className="text-sm lg:text-lg">
              {profile?.username} bet {makeNum(bet?.amount)} on{' '}
              {teamPicked?.name}
            </p>
            <p className="text-xs">
              Odds: {makeNum(bet?.odds)} | Profit:{' '}
              {(parseFloat(makeNum(bet?.odds)) * parseFloat(betValue)).toFixed(
                2
              )}
            </p>
          </div>

          {myBet && betState === BET_STATE[0] && <CancelBet betId={betId} />}
          {!myBet && betState === BET_STATE[0] && (
            <BetAccept betValue={betValue} betId={betId} />
          )}
          {betState === BET_STATE[1] && <BetAccepted betId={betId} />}
          {betState === BET_STATE[2] && <BetFinished betId={betId} />}
          {betState === BET_STATE[3] && <BetCancelled />}
        </div>
      )}
    </div>
  );
};
