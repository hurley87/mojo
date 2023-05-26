import { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { UserContext } from '@/lib/UserContext';
import { BetAccepted } from './BetAccepted';
import { BetCancelled } from './BetCancelled';
import { BetFinished } from './BetFinished';
import { useGamesRead } from '@/hooks/useGamesRead';
import Link from 'next/link';
import { AiOutlineCopy, AiOutlineDoubleRight } from 'react-icons/ai';
import toast from 'react-hot-toast';

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

  async function copyShareLink() {
    navigator.clipboard.writeText(
      `${window.origin}/bets/${bet?.gameId.toNumber()}`
    );
    toast.success('Share link copied!');
  }

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
              {myBet ? 'You' : profile?.username} placed{' '}
              {bet?.amount.toNumber()} MOJO on the {teamPicked?.name}
            </p>
            <div className="flex flex-row gap-1 pt-1">
              <p className="text-xs">
                Asking for an opponent to place {bet?.counter.toNumber()} MOJO
                on the {otherTeamPicked?.name}.
              </p>
            </div>
          </div>
          {betState === BET_STATE[0] && !isGameStarted && (
            <div className="flex gap-2">
              <button
                onClick={() => copyShareLink()}
                className="btn btn-square"
              >
                <AiOutlineCopy className="w-6 h-6" />
              </button>

              <Link href={`/bets/${betId}`}>
                <button className="btn btn-square">
                  <AiOutlineDoubleRight className="w-6 h-6" />
                </button>
              </Link>
            </div>
          )}
          {betState === BET_STATE[0] && isGameStarted && (
            <button disabled={true} className="btn">
              Game Has Started
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
