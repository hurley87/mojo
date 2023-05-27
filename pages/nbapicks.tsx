import Picks from '@/components/Picks';
import Layout from '@/components/Layout';
import { nba } from '@/lib/nba';

export default function PicksPage() {
  return (
    <Layout sport={nba}>
      <Picks sport={nba} />
    </Layout>
  );
}
