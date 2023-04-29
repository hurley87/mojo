import React from 'react';
import moment from 'moment';
import { useGamesRead } from '@/hooks/useGamesRead';
import { CreateBet } from './BetCreate';
import Bets from './Bets';
import Link from 'next/link';

const GameView = ({ gameId }: { gameId: string }) => {
  const { data: homeTeamName } = useGamesRead({
    functionName: 'getGameHomeTeamName',
    args: [gameId],
  });
  const { data: awayTeamName } = useGamesRead({
    functionName: 'getGameAwayTeamName',
    args: [gameId],
  });
  const { data: awayTeamId } = useGamesRead({
    functionName: 'getGameAwayTeamId',
    args: [gameId],
  });
  const { data: homeTeamId, isLoading } = useGamesRead({
    functionName: 'getGameHomeTeamId',
    args: [gameId],
  });
  const { data: startTime } = useGamesRead({
    functionName: 'getGameStartTime',
    args: [gameId],
  });
  const date = new Date();

  return (
    <div>
      <div className="text-sm breadcrumbs mb-2">
        <ul>
          <li>
            <Link href="/">Games</Link>
          </li>
          <li>
            {homeTeamName} vs {awayTeamName},{' '}
            {startTime &&
              moment.unix(startTime.toNumber()).format('MMMM Do [at] h:mm a')}
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
          {!isLoading && awayTeamId?.toNumber() && homeTeamId?.toNumber() && (
            <CreateBet
              gameId={parseInt(gameId)}
              homeTeamName={homeTeamName}
              awayTeamName={awayTeamName}
              awayTeamId={awayTeamId?.toNumber()}
              homeTeamId={homeTeamId?.toNumber()}
            />
          )}
        </>
      )}
      <Bets gameId={parseInt(gameId)} />
    </div>
  );
};

export default GameView;
