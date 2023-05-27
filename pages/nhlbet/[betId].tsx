import type { NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import BetView from '@/components/BetView';
import { nhl } from '@/lib/nhl';

const ViewBetPage: NextPage = () => {
  const [betId, setBetId] = React.useState<string | undefined>();
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      setBetId(router.query.betId?.toString());
    }
  }, [router.isReady, router.query]);

  return (
    <Layout sport={nhl}>
      {!!betId && <BetView sport={nhl} betId={betId} />}
    </Layout>
  );
};

export default ViewBetPage;
