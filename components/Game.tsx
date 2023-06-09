import React from 'react';
import moment from 'moment';
import { useRead } from '@/hooks/useRead';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import Link from 'next/link';

const Game = ({ gameId, sport }: { gameId: string; sport: any }) => {
  const { data: homeTeamName } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
    functionName: 'getGameHomeTeamName',
    args: [gameId],
  });
  const { data: awayTeamName } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
    functionName: 'getGameAwayTeamName',
    args: [gameId],
  });
  const { data: startTime, isLoading } = useRead({
    contractName: 'Games',
    address: sport.gamesAddress,
    functionName: 'getGameStartTime',
    args: [gameId],
  });

  return isLoading || startTime === undefined ? (
    <div className="h-5 w-full animate-pulse bg-primary-focus rounded-md"></div>
  ) : (
    <div className="flex justify-between w-full">
      <div>
        <h3 className="text-xs lg:text-lg w-2/3 lg:w-full font-extrabold">
          {homeTeamName} vs {awayTeamName}
        </h3>
        <p className="text-xs lg:text-sm">
          {startTime &&
            moment.unix(startTime.toNumber()).format('MMMM Do [at] h:mm a')}
        </p>
      </div>
      <Link href={`/${sport.sport}/${gameId}`}>
        <button className="btn btn-square btn-primary">
          <AiOutlineDoubleRight className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default Game;
