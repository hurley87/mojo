import React from 'react';
import Game from './Game';
import { useGamesRead } from '@/hooks/useGamesRead';

const Games = () => {
  const { data: games, isLoading } = useGamesRead({
    functionName: 'getGames',
    args: [],
  });

  return (
    <div className="p-4 lg:p-6 card bg-base-300 w-full">
      {!isLoading &&
        games !== undefined &&
        games?.map((game: any, index: number) => (
          <>
            {index !== 0 && <div className="divider"></div>}
            <Game
              key={game.gameId.toNumber()}
              gameId={game.gameId.toNumber()}
            />
          </>
        ))}
    </div>
  );
};

export default Games;
