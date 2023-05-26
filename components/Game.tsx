import React from 'react';
import moment from 'moment';
import { useGamesRead } from '@/hooks/useGamesRead';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import Link from 'next/link';

const Game = ({ gameId, contract }: { gameId: string; contract: any }) => {
  const { data: homeTeamName } = useGamesRead({
    address: contract.games,
    functionName: 'getGameHomeTeamName',
    args: [gameId],
  });
  const { data: awayTeamName } = useGamesRead({
    address: contract.games,
    functionName: 'getGameAwayTeamName',
    args: [gameId],
  });
  const { data: startTime, isLoading } = useGamesRead({
    address: contract.games,
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
      <Link href={`/${contract.sport}/${gameId}`}>
        <button className="btn btn-square">
          <AiOutlineDoubleRight className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
};

export default Game;
