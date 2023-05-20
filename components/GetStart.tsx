import { magic } from '@/lib/magic';
import { FAQ } from './FAQ';

export const GetStarted = () => {
  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }
  return (
    <div>
      <div className="hero">
        <div className="text-center hero-content">
          <div className="max-w-4xl pt-10">
            <h1 className="mb-3 text-3xl md:text-3xl lg:text-5xl font-bold">
              P2P Sports Betting
            </h1>
            <p className="mb-6 text-sm lg:text-lg">
              Starting with the NHL playoffs, earn MOJO tokens by picking
              winning teams. The player with the most tokens at the end of the
              playoffs will earn a $500 prize.
            </p>
            <button onClick={login} className="btn btn-primary">
              Connect Your Discord Account
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold pt-20">Making Picks is Easy</h2>
      <video
        controls
        className="w-full h-full object-cover py-4"
        // style={{ width: '500px', height: '500px', margin: 'auto' }}
      >
        <source src="/mojo.mp4" />
      </video>
      <h2 className="text-3xl font-bold pt-20">FAQ</h2>
      <FAQ />
    </div>
  );
};
