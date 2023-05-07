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
      <div className="alert alert-warning">
        <div className="flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <label>Betting period is over.</label>
        </div>
      </div>
      <DerbyBets />
    </Layout>
  );
}
