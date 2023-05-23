import React, { useContext, useState } from 'react';
import moment from 'moment';
import { useBetsRead } from '@/hooks/useBetsRead';
import { CreateBet } from './BetCreate';
import { CancelBet } from './BetCancel';
import { BetAccept } from './BetAccept';
import Link from 'next/link';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { useGamesRead } from '@/hooks/useGamesRead';
import { UserContext } from '@/lib/UserContext';
import { makeBig } from '@/lib/number-utils';
import toast from 'react-hot-toast';

const BET_STATE = ['Created', 'Accepted', 'Finished', 'Cancelled'];

const BetView = ({ betId }: { betId: string }) => {
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
  const { data: homeTeamName } = useGamesRead({
    functionName: 'getGameHomeTeamName',
    args: [bet?.gameId.toNumber()],
  });
  const { data: awayTeamName } = useGamesRead({
    functionName: 'getGameAwayTeamName',
    args: [bet?.gameId.toNumber()],
  });
  const { data: startTime } = useGamesRead({
    functionName: 'getGameStartTime',
    args: [bet?.gameId.toNumber()],
  });
  const myBet =
    user?.publicAddress?.toLowerCase() === bet?.creator?.toLowerCase();
  const date = new Date();
  const isGameStarted = startTime?.toNumber() < date.getTime() / 1000;

  async function copyShareLink() {
    navigator.clipboard.writeText(`${window.origin}/bets/${betId}`);
    toast.success('Share link copied!');
  }

  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href={`/games/${bet?.gameId.toNumber()}`}>
              {homeTeamName} vs {awayTeamName},{' '}
              {startTime &&
                moment.unix(startTime.toNumber()).format('MMMM Do [at] h:mm a')}
            </Link>
          </li>
        </ul>
      </div>

      {startTime && startTime.toNumber() < date.getTime() / 1000 ? (
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
            <label>Betting period is over.</label>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm lg:text-2xl font-bold pt-3">
            {myBet ? 'You' : profile?.username} bet {bet?.amount.toNumber()}{' '}
            MOJO on the {teamPicked?.name}
          </p>
          <div className="flex flex-row gap-1 pt-1 pb-6">
            {bet?.creator.toLowerCase() ===
            user?.publicAddress.toLowerCase() ? (
              <p className="text-md">
                Share this bet with a friend and ask them to place{' '}
                {bet?.counter.toNumber()} MOJO on the {otherTeamPicked?.name}.
                If the {teamPicked?.name} win {"you'll"} receive{' '}
                {bet?.amount.toNumber() + bet?.counter.toNumber()} MOJO the next
                day.
              </p>
            ) : (
              <p className="text-md">
                Place {bet?.counter.toNumber()} MOJO on the{' '}
                {otherTeamPicked?.name} to accept the bet. If the{' '}
                {otherTeamPicked?.name} win {"you'll"} receive{' '}
                {bet?.amount.toNumber() + bet?.counter.toNumber()} MOJO the next
                day.
              </p>
            )}
          </div>
          <div className="flex flex-row gap-2">
            {myBet && betState === BET_STATE[0] && (
              <>
                <CancelBet betId={betId} />
                <button onClick={copyShareLink} className={`btn btn-primary`}>
                  Copy Share Link
                </button>
              </>
            )}
            {!myBet && betState === BET_STATE[0] && !isGameStarted && (
              <BetAccept betId={betId} />
            )}
            {!myBet && betState === BET_STATE[0] && isGameStarted && (
              <button disabled={true} className="btn">
                Game Has Started
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BetView;
