import Games from '@/components/Games';
import Layout from '@/components/Layout';
import { Leaderboard } from '@/components/Leaderboard';
import { useState } from 'react';

export default function Hockey() {
  const [showGames, setShowGames] = useState(true);

  return (
    <Layout>
      <div className="tabs tabs-boxed my-4 bg-transparent">
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
          Leaderboard
        </a>
      </div>
      {showGames ? <Games /> : <Leaderboard />}
    </Layout>
  );
}
