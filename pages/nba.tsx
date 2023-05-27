import Layout from '@/components/Layout';
import GamesPage from '@/components/GamesPage';
import { nba } from '@/lib/nba';

export default function NHL() {
  return (
    <Layout sport={nba}>
      <GamesPage sport={nba} />
    </Layout>
  );
}
