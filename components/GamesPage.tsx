import React from 'react';
import Games from '@/components/Games';
import { Leaderboard } from '@/components/Leaderboard';
import { useState } from 'react';

const GamesPage = ({ contract }: { contract: any }) => {
  const [showGames, setShowGames] = useState(true);
  return (
    <>
      <div className="tabs tabs-boxed mb-4 bg-transparent gap-2">
        <a
          onClick={() => setShowGames(false)}
          className={`tab border border-2 border-primary ${
            !showGames && 'tab-active'
          }`}
        >
          Top 10
        </a>
        <a
          onClick={() => setShowGames(true)}
          className={`tab border border-2 border-primary ${
            showGames && 'tab-active'
          }`}
        >
          Games
        </a>
      </div>
      {showGames ? (
        <Games contract={contract} />
      ) : (
        <Leaderboard address={contract.profiles} />
      )}
    </>
  );
};

export default GamesPage;
