import React from 'react';
import Game from './Game';
import { useRead } from '@/hooks/useRead';

const GamesByDay = ({ day, sport }: { day: string; sport: any }) => {
  const { data: games, isLoading } = useRead({
    contractName: 'Games',
    functionName: 'getGamesByDay',
    address: sport.gamesAddress,
    args: [day],
  });

  return (
    <div className="p-4 lg:p-6 card bg-base-300 w-full">
      {!isLoading && games !== undefined && games?.length === 0 && (
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
            No games have been scheduled.
          </div>
        </div>
      )}
      {!isLoading &&
        games !== undefined &&
        games?.map((game: any, index: number) => (
          <div key={game.gameId.toNumber()}>
            {index !== 0 && <div className="divider"></div>}
            <Game sport={sport} gameId={game.gameId.toNumber()} />
          </div>
        ))}
    </div>
  );
};

export default GamesByDay;
