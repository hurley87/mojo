import Games from '@/components/Games';
import Layout from '@/components/Layout';

export default function Hockey() {
  return (
    <Layout>
      <p className="text-sm pt-2 pb-3">
        <a
          target="_blank"
          className="text-primary underline"
          href="https://thescore.bet"
        >
          Read more about the NHL playoffs and the odds for each game.
        </a>
      </p>
      <Games />
    </Layout>
  );
}
