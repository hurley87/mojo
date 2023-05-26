import type { NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import GameView from '@/components/GameView';
import { nhlContract } from '@/lib/nhlContracts';

const ViewGamePage: NextPage = () => {
  const [gameId, setGameId] = React.useState<string | undefined>();
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      setGameId(router.query.gameId?.toString());
    }
  }, [router.isReady, router.query]);

  return (
    <Layout contract={nhlContract}>
      {!!gameId && <GameView contract={nhlContract} gameId={gameId} />}
    </Layout>
  );
};

export default ViewGamePage;
