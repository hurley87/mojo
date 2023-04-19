import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Head from 'next/head';
type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children }: Props) => (
  <div className="flex flex-col h-screen justify-between p-4">
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="P2P sports betting protocol" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@davidhurley87" />
      <meta name="twitter:title" content="MOJO" />
      <meta name="twitter:description" content="P2P sports betting protocol" />
      <meta
        name="twitter:image"
        content={`https://consumercrypto.club/future.png`}
      />
      <meta property="og:url" content={`https://consumercrypto.club`} />
      <meta property="og:title" content="MOJO" />
      <meta property="og:description" content="P2P sports betting protocol" />
      <meta
        property="og:image"
        content={`https://consumercrypto.club/future.png`}
      />
    </Head>
    <div>
      <Navbar />
      <div className="container lg:w-1/2 mx-auto px-4 pb-10">{children}</div>
    </div>
    <footer className="p-4 footer text-base-content footer-center">
      <div>
        <p>Copyright © 2023 - All right reserved by MOJO</p>
      </div>
    </footer>
  </div>
);

export default Layout;
