import { DerbyBetCreate } from '@/components/DerbyBetCreate';
import DerbyBets from '@/components/DerbyBets';
import Layout from '@/components/Layout';

export default function Derby() {
  return (
    <Layout>
      <p className="text-sm pt-2 pb-3">
        <a
          target="_blank"
          className="text-primary underline"
          href="https://www.cbssports.com/general/news/kentucky-derby-2023-contenders-horses-field-lineup-odds-expert-whos-nailed-prep-races-unveils-picks/"
        >
          Read more about the Kentucky Derby 2023 contenders, horses, field,
          lineup, odds.
        </a>
      </p>
      <DerbyBetCreate />
      <DerbyBets />
    </Layout>
  );
}
