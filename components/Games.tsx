import React, { useState } from 'react';
import Game from './Game';
import { useGamesRead } from '@/hooks/useGamesRead';
import moment from 'moment';
import GamesByDay from './GamesByDay';

function getPreviousDay(date: Date) {
  var previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return previousDay;
}

function getNextDay(date: Date) {
  var nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
}

function convertDateToString(date: Date) {
  return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
}

const Games = () => {
  const [currentDay, setCurrentDay] = useState(new Date());
  const { data: games, isLoading } = useGamesRead({
    functionName: 'getGames',
    args: [],
  });
  const { data: goodGames } = useGamesRead({
    functionName: 'getGamesByDay',
    args: ['3-26-2023'],
  });

  return (
    <>
      <div className="tabs pb-4 uppercase">
        <a
          onClick={() => setCurrentDay(getPreviousDay(currentDay))}
          className="tab tab-bordered"
        >
          {moment(getPreviousDay(currentDay)).format('MMM Do')}
        </a>
        <a className="tab tab-bordered tab-active">
          {moment(currentDay).format('MMM Do')}
        </a>
        <a
          onClick={() => setCurrentDay(getNextDay(currentDay))}
          className="tab tab-bordered"
        >
          {moment(getNextDay(currentDay)).format('MMM Do')}
        </a>
      </div>
      <GamesByDay day={convertDateToString(currentDay)} />
    </>
  );
};

export default Games;
