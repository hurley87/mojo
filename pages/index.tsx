import FixedBanner from '@/components/Fixedbanner';
import Link from 'next/link';
import { GiHockey, GiBasketballBasket } from 'react-icons/gi';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import { UserContext } from '@/lib/UserContext';
import LayoutSecondary from '@/components/LayoutSecondary';
import LayoutMeta from '@/components/LayoutMeta';

export default function Home() {
  const [user, _]: any = useContext(UserContext);
  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }
  return (
    <LayoutSecondary>
      <FixedBanner
        url="/referrals"
        text="Earn MOJO tokens by referring friends"
      />
      <div className="hero pt-10">
        <div className="text-center hero-content">
          <div className="max-w-4xl pt-10">
            <h1 className="mb-3 text-3xl md:text-3xl lg:text-5xl font-bold">
              P2P Sports Betting
            </h1>
            <p className="mb-6 text-sm lg:text-lg max-w-2xl mx-auto">
              Starting with the NHL and NBA, earn MOJO tokens for correctly
              picking game winners. The player with the most tokens will earn a
              prize.
            </p>
            {user ? (
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <div className="w-full">
                  <Link href="/nhl">
                    <button className="btn btn-primary w-full">
                      <GiHockey className="h-6 w-6 mr-2" />
                      NHL
                    </button>
                  </Link>
                </div>
                <div className="w-full">
                  <Link href="/nba">
                    <button className="btn btn-primary w-full">
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
    </LayoutSecondary>
  );
}
