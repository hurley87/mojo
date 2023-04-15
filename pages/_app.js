import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useEffect, useState } from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { providers } from 'ethers';

// Use wagmi to configure the provider.
// Right now, we will only connect to hardhat's standalone localhost network
const provider = new providers.JsonRpcProvider(
  `https://attentive-rough-shape.base-goerli.quiknode.pro/${process.env.NEXT_PUBLIC_QUICK_NODE}/`,
  { name: 'base-goerli', chainId: 84531, ensAddress: undefined }
);

// Give wagmi our provider config and allow it to autoconnect wallet
const client = createClient({
  autoConnect: true,
  provider,
});

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData));
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

  return (
    <WagmiConfig client={client}>
      <UserContext.Provider value={[user, setUser]}>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </UserContext.Provider>
    </WagmiConfig>
  );
}

export default MyApp;
