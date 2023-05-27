import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import FixedBanner from '@/components/Fixedbanner';
import Link from 'next/link';
import { GiHockey, GiBasketballBasket } from 'react-icons/gi';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import { UserContext } from '@/lib/UserContext';

export default function Home() {
  const router = useRouter();
  const [user, _]: any = useContext(UserContext);
  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }
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
        <div className="hero">
          <div className="text-center hero-content">
            <div className="max-w-4xl pt-10">
              <h1 className="mb-3 text-3xl md:text-3xl lg:text-5xl font-bold">
                P2P Sports Betting
              </h1>
              <p className="mb-6 text-sm lg:text-lg max-w-2xl mx-auto">
                Starting with the NHL and NBA, earn MOJO tokens by picking
                winner. The player with the most tokens at the end of the
                playoffs will earn a prize.
              </p>
              {user ? (
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <div className="w-full">
                    <Link href="/nhl">
                      <button className="btn btn-primary btn-outline w-full">
                        <GiHockey className="h-6 w-6 mr-2" />
                        NHL
                      </button>
                    </Link>
                  </div>
                  <div className="w-full">
                    <Link href="/nba">
                      <button className="btn btn-primary btn-outline w-full">
                        <GiBasketballBasket className="h-6 w-6 mr-2" /> NBA
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <button onClick={login} className="btn btn-primary">
                  Connect Your Discord Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
