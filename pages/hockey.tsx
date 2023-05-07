import Games from '@/components/Games';
import Layout from '@/components/Layout';

export default function Hockey() {
  return (
    <Layout>
      <div className="tabs tabs-boxed my-4 bg-transparent">
        <a className="tab tab-active">Games</a>
        <a className="tab">Leaderboard</a>
      </div>
      <Games />
    </Layout>
  );
}
