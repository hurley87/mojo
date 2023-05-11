import { magic } from '@/lib/magic';

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
              Onchain Fantasy Sports
            </h1>
            <p className="mb-6 text-sm lg:text-xl">
              Compete with friends for bragging rights. Pick winners to earn
              tokens.
            </p>
            <button onClick={login} className="btn btn-primary">
              Connect Your Discord Account
            </button>
          </div>
        </div>
      </div>
      <video
        controls
        className="w-full h-full object-cover py-10"
        // style={{ width: '500px', height: '500px', margin: 'auto' }}
      >
        <source src="/mojo.mp4" />
      </video>
    </div>
  );
};
