import Picks from '@/components/Picks';
import Layout from '@/components/Layout';
import { nbaContract } from '@/lib/nbaContracts';

export default function PicksPage() {
  return (
    <Layout contract={nbaContract}>
      <Picks contract={nbaContract} />
    </Layout>
  );
}
