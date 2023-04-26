import React from 'react';
import Game from './Game';
import { useGamesRead } from '@/hooks/useGamesRead';

const GamesByDay = ({ day }: { day: string }) => {
  const { data: games, isLoading } = useGamesRead({
    functionName: 'getGamesByDay',
    args: [day],
  });

  console.log(games);

  return (
    <div className="p-4 lg:p-6 card bg-base-300 w-full">
      {!isLoading &&
        games !== undefined &&
        games?.map((game: any, index: number) => (
          <div key={game.gameId.toNumber()}>
            {index !== 0 && <div className="divider"></div>}
            <Game gameId={game.gameId.toNumber()} />
          </div>
        ))}
    </div>
  );
};

export default GamesByDay;
