import Layout from '@/components/Layout';
import GamesPage from '@/components/GamesPage';
import { nbaContract } from '@/lib/nbaContracts';

export default function NHL() {
  return (
    <Layout contract={nbaContract}>
      <GamesPage contract={nbaContract} />
    </Layout>
  );
}
