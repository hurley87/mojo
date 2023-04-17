import React from 'react';
import Game from './Game';
import { useGamesRead } from '@/hooks/useGamesRead';
import Link from 'next/link';

const Games = () => {
  const { data: games, isLoading } = useGamesRead({
    functionName: 'getGames',
    args: [],
  });

  return (
    <div>
      {!isLoading &&
        games !== undefined &&
        games?.map((game: any) => (
          <Link key={game.gameId.toNumber()} href={`/games/${game.gameId}`}>
            <Game gameId={game.gameId.toNumber()} />
          </Link>
        ))}
    </div>
  );
};

export default Games;
