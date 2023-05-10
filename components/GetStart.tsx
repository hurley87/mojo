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
          <p className="pb-4">
            <Image
              height="150"
              width="150"
              src="/logo.svg"
              alt="logo"
              style={{ display: 'inline-block', margin: 'auto' }}
            />
          </p>

          <h1 className="mb-3 text-3xl md:text-5xl lg:text-6xl font-bold">
            Onchain Fantasy Sports
          </h1>
          <p className="mb-6 text-lg lg:text-xl">
            Compete with friends for bragging rights. Pick winners to earn
            tokens.
          </p>
          <button onClick={login} className="btn btn-primary">
            Connect Your Discord Account
          </button>
        </div>
      </div>
    </div>
  );
};
