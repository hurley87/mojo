import Picks from '@/components/Picks';
import Layout from '@/components/Layout';
import { nhlContract } from '@/lib/nhlContracts';

export default function PicksPage() {
  return (
    <Layout contract={nhlContract}>
      <Picks contract={nhlContract} />
    </Layout>
  );
}
