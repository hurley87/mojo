import Picks from '@/components/Picks';
import Layout from '@/components/Layout';
import { nhl } from '@/lib/nhl';

export default function PicksPage() {
  return (
    <Layout sport={nhl}>
      <Picks sport={nhl} />
    </Layout>
  );
}
