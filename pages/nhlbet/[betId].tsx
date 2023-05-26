import type { NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import BetView from '@/components/BetView';
import { nhlContract } from '@/lib/nhlContracts';

const ViewBetPage: NextPage = () => {
  const [betId, setBetId] = React.useState<string | undefined>();
  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      setBetId(router.query.betId?.toString());
    }
  }, [router.isReady, router.query]);

  return (
    <Layout contract={nhlContract}>
      {!!betId && <BetView contract={nhlContract} betId={betId} />}
    </Layout>
  );
};

export default ViewBetPage;
