import { useContext, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';
import { BetAccepted } from './BetAccepted';
import { BetCancelled } from './BetCancelled';
import { BetFinished } from './BetFinished';
import Link from 'next/link';
import { AiOutlineCopy, AiOutlineDoubleRight } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { BetCancel } from './BetCancel';

const BET_STATE = ['Created', 'Accepted', 'Finished', 'Cancelled'];

export const Bet = ({ betId, sport }: { betId: BigNumber; sport: any }) => {
  const [user, _]: any = useContext(UserContext);
  const { data: bet, isLoading: isBetLoading } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const [betState, setBetState] = useState(BET_STATE[0]);
  const { data: profile } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useRead({
    contractName: 'Teams',
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });
  const { data: otherTeamPicked } = useRead({
    contractName: 'Teams',
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.otherTeamPickedId?.toNumber()],
  });
  const { data: startTime } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
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
    navigator.clipboard.writeText(`${window.origin}/${sport.betPath}/${betId}`);
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
                className="btn btn-square btn-primary"
              >
                <AiOutlineCopy className="w-6 h-6" />
              </button>

              <Link href={`/${sport.betPath}/${betId}`}>
                <button className="btn btn-square btn-primary">
                  <AiOutlineDoubleRight className="w-6 h-6" />
                </button>
              </Link>
            </div>
          )}
          {!myBet && betState === BET_STATE[0] && isGameStarted && (
            <button disabled={true} className="btn">
              Game Has Started
            </button>
          )}
          {myBet && betState === BET_STATE[0] && isGameStarted && (
            <BetCancel sport={sport} betId={betId.toNumber().toString()} />
          )}
          {betState === BET_STATE[1] && (
            <BetAccepted sport={sport} betId={betId} />
          )}
          {betState === BET_STATE[2] && (
            <BetFinished sport={sport} betId={betId} />
          )}
          {betState === BET_STATE[3] && <BetCancelled />}
        </div>
      )}
    </div>
  );
};
