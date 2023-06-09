import React, { useContext } from 'react';
import moment from 'moment';
import { BetCancel } from './BetCancel';
import { BetAccept } from './BetAccept';
import Link from 'next/link';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';

const BetView = ({ betId, sport }: { betId: string; sport: any }) => {
  const [user, _]: any = useContext(UserContext);
  const { data: bet } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
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
  const { data: homeTeamName } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
    functionName: 'getGameHomeTeamName',
    args: [bet?.gameId.toNumber()],
  });
  const { data: awayTeamName } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
    functionName: 'getGameAwayTeamName',
    args: [bet?.gameId.toNumber()],
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

  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href={`/${sport.sport}/${bet?.gameId.toNumber()}`}>
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
            {myBet && bet?.state === 0 && (
              <>
                <BetCancel sport={sport} betId={betId} />
                <a
                  href={`https://twitter.com/intent/tweet?text=Just%20bet%20on%20the%20${teamPicked?.name}&via=mojop2p&url=https://mojo.club/${sport.betPath}/${betId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className={`btn btn-primary`}>
                    Share to Twitter
                  </button>
                </a>
              </>
            )}
            {!myBet && !isGameStarted && bet?.state === 0 && (
              <BetAccept sport={sport} betId={betId} />
            )}
            {!myBet && isGameStarted && (
              <button disabled={true} className="btn">
                Game Has Started
              </button>
            )}
            {bet?.state === 3 && (
              <button disabled={true} className="btn">
                Bet Cancelled
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BetView;
