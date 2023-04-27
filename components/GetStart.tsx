import { magic } from '@/lib/magic';
import Image from 'next/image';

export const GetStarted = () => {
  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }
  return (
    <div className="hero">
      <div className="text-center hero-content">
        <div className="max-w-4xl">
          <p className="pb-8">
            <Image
              height="150"
              width="150"
              src="/logo.svg"
              alt="logo"
              style={{ display: 'inline-block', margin: 'auto' }}
            />
          </p>

          <h1 className="mb-5 text-6xl font-bold">
            Cut out the middleman. Bet your friend directly.
          </h1>
          <p className="mb-8 text-xl">
            MOJO makes betting with friends easy, transparent, and fair without
            the need for a casino, bookie, offshore site, or other middleman.
          </p>
          <button onClick={login} className="btn btn-primary">
            Connect Your Discord Account
          </button>
        </div>
      </div>
    </div>
  );
};
