import React from 'react';
import Games from '@/components/Games';
import { Leaderboard } from '@/components/Leaderboard';
import { useState } from 'react';

const Hockey = () => {
  const [showGames, setShowGames] = useState(true);
  return (
    <>
      <div className="tabs tabs-boxed mb-4 bg-transparent">
        <a
          onClick={() => setShowGames(true)}
          className={`tab ${showGames && 'tab-active'}`}
        >
          Games
        </a>
        <a
          onClick={() => setShowGames(false)}
          className={`tab ${!showGames && 'tab-active'}`}
        >
          Top 10
        </a>
      </div>
      {showGames ? <Games /> : <Leaderboard />}
    </>
  );
};

export default Hockey;
