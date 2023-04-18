import React from 'react';
import moment from 'moment';
import { useGamesRead } from '@/hooks/useGamesRead';

const Game = ({ gameId }: { gameId: string }) => {
  const { data: homeTeamName } = useGamesRead({
    functionName: 'getGameHomeTeamName',
    args: [gameId],
  });
  const { data: awayTeamName } = useGamesRead({
    functionName: 'getGameAwayTeamName',
    args: [gameId],
  });
  const { data: startTime } = useGamesRead({
    functionName: 'getGameStartTime',
    args: [gameId],
  });

  console.log('startTime', startTime);

  return (
    <div>
      {homeTeamName} vs {awayTeamName},{' '}
      {startTime &&
        moment.unix(startTime.toNumber()).format('MMMM Do [at] h:mm a')}
    </div>
  );
};

export default Game;
