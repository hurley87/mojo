import React from 'react';
import moment from 'moment';
import { useGamesRead } from '@/hooks/useGamesRead';

const ViewGame = ({ gameId }: { gameId: string }) => {
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
  const [sliderValue, setSliderValue] = React.useState('10');

  console.log('startTime', startTime.toNumber());

  console.log(sliderValue);

  return (
    <div>
      <h1 className="text-xl">
        {homeTeamName} vs {awayTeamName}
      </h1>
      <h1 className="text-xl">
        {homeTeamName} vs {awayTeamName}
      </h1>
      <p className="text-sm">
        {startTime &&
          moment.unix(startTime.toNumber()).format('MMMM Do [at] h:mm a')}
      </p>

      <p>ok now</p>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => {
          setSliderValue(e.target.value);
        }}
        className="range range-primary"
      />
      <div className="btn-group">
        <button className="btn btn-active btn-sm btn-square">+</button>
        <div className="text-lg">1.01</div>
        <button className="btn btn-sm btn-active btn-square ">-</button>
      </div>
    </div>
  );
};

export default ViewGame;
