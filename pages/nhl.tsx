import Layout from '@/components/Layout';
import GamesPage from '@/components/GamesPage';
import { nhlContract } from '@/lib/nhlContracts';

export default function NHL() {
  return (
    <Layout contract={nhlContract}>
      <GamesPage contract={nhlContract} />
    </Layout>
  );
}
