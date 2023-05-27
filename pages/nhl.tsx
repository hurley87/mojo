import Layout from '@/components/Layout';
import GamesPage from '@/components/GamesPage';
import { nhl } from '@/lib/nhl';

export default function NHL() {
  return (
    <Layout sport={nhl}>
      <GamesPage sport={nhl} />
    </Layout>
  );
}
