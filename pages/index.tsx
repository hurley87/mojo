import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { Inter } from 'next/font/google';
import { useContext } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [user, _]: any = useContext(UserContext);
  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }

  console.log(user);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-6xl font-bold">Mojo</h1>
      <p className={inter.className}>P2P Sports Betting</p>
      {!user?.loading && !user?.issuer ? (
        <button onClick={login}>Login</button>
      ) : (
        <div>good times</div>
      )}
    </main>
  );
}
