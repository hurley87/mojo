import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useEffect, useState } from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { providers } from 'ethers';
import { Analytics } from '@vercel/analytics/react';
import * as fbq from '../lib/fpixel';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Iframe from 'react-iframe';

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
  const router = useRouter();

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    setUser({ loading: true });
    try {
      new Crate({
        server: '1096831241631830059', // Mojo
        channel: '1112815729218162768', // #referrals
      });
    } catch (e) {
      console.log(e);
    }
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
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
          }}
        />
        <Component {...pageProps} />
        <Toaster position="top-center" />
        <Analytics />
      </UserContext.Provider>
    </WagmiConfig>
  );
}

export default MyApp;
