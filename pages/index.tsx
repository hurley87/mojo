import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import FixedBanner from '@/components/Fixedbanner';
import Link from 'next/link';
import { GiHockey, GiBasketballBasket } from 'react-icons/gi';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <Head>
        <title>Mojo | P2P Sports Betting</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="P2P Sports Betting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@davidhurley87" />
        <meta name="twitter:title" content="Mojo" />
        <meta name="twitter:description" content="P2P Sports Betting" />
        <meta
          name="twitter:image"
          content="https://pollock-art.s3.amazonaws.com/meta2.png"
        />
        <meta property="og:url" content={`https://mojo.club`} />
        <meta property="og:title" content="Mojo" />
        <meta property="og:description" content="P2P Sports Betting" />
        <meta
          property="og:image"
          content="https://pollock-art.s3.amazonaws.com/meta2.png"
        />
      </Head>
      <div className="pt-10">
        <FixedBanner />
        <Navbar sport={null} />
        <div className="container lg:w-1/4 mx-auto lg:px-4 pt-4 pb-20">
          <br />
          <div className="w-full">
            <Link href="/nhl">
              <button className="btn btn-primary btn-outline w-full">
                <GiHockey className="h-6 w-6 mr-2" />
                NHL
              </button>
            </Link>
          </div>
          <br />
          <div className="w-full">
            <Link href="/nba">
              <button className="btn btn-primary btn-outline w-full">
                <GiBasketballBasket className="h-6 w-6 mr-2" /> NBA
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
