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
    <div className="h-5 w-full animate-pulse bg-primary-focus"></div>
  ) : (
    <div className={`flex space-x-2 text-sm`}>
      {isBetLoading && <div>Loading...</div>}
      {!isBetLoading && bet && (
        <div className={`flex space-x-2 text-sm pt-4`}>
          <p className="mt-0.5">
            {profile?.username} bet {makeNum(bet?.amount)}, odds:{' '}
            {makeNum(bet?.odds)} on {teamPicked?.name}
          </p>
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
