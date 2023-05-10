import { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { UserContext } from '@/lib/UserContext';
import { CancelBet } from './BetCancel';
import { BetAccept } from './BetAccept';
import { BetAccepted } from './BetAccepted';
import { BetCancelled } from './BetCancelled';
import { BetFinished } from './BetFinished';
import { useGamesRead } from '@/hooks/useGamesRead';

const BET_STATE = ['Created', 'Accepted', 'Finished', 'Cancelled'];

export const Bet = ({ betId }: { betId: BigNumber }) => {
  const [user, _]: any = useContext(UserContext);
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    functionName: 'getBet',
    args: [betId],
  });
  const [betState, setBetState] = useState(BET_STATE[0]);
  const { data: profile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });
  const { data: otherTeamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [bet?.otherTeamPickedId?.toNumber()],
  });
  const { data: startTime } = useGamesRead({
    functionName: 'getGameStartTime',
    args: [bet?.gameId.toNumber()],
  });
  const myBet =
    user?.publicAddress?.toLowerCase() === bet?.creator?.toLowerCase();
  const date = new Date();
  const isGameStarted = startTime?.toNumber() < date.getTime() / 1000;

  useEffect(() => {
    if (bet?.state) setBetState(BET_STATE[bet?.state]);
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
        <div className="flex flex-col md:flex-row gap-3 md:justify-between w-full">
          <div className="flex flex-col gap-0">
            <p className="text-sm lg:text-md font-bold">
              {profile?.username} staked {bet?.amount.toNumber()} MOJO on the{' '}
              {teamPicked?.name}
            </p>
            <div className="flex flex-row gap-1 pt-1">
              {bet?.creator.toLowerCase() ===
              user?.publicAddress.toLowerCase() ? (
                <p className="text-xs">
                  Ask a friend to stake {bet?.counter.toNumber()} MOJO on the{' '}
                  {otherTeamPicked?.name}
                </p>
              ) : (
                <p className="text-xs">
                  Stake {bet?.counter.toNumber()} MOJO on the{' '}
                  {otherTeamPicked?.name} and earn {bet?.amount.toNumber()} MOJO
                  if they win
                </p>
              )}
            </div>
          </div>

          {myBet && betState === BET_STATE[0] && <CancelBet betId={betId} />}
          {!myBet && betState === BET_STATE[0] && !isGameStarted && (
            <BetAccept counter={bet?.counter.toNumber()} betId={betId} />
          )}
          {!myBet && betState === BET_STATE[0] && isGameStarted && (
            <button disabled={true} className="btn">
              Betting period is over
            </button>
          )}
          {betState === BET_STATE[1] && <BetAccepted betId={betId} />}
          {betState === BET_STATE[2] && <BetFinished betId={betId} />}
          {betState === BET_STATE[3] && <BetCancelled />}
        </div>
      )}
    </div>
  );
};
