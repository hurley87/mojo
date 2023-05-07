import React, { ReactNode, useContext } from 'react';
import Navbar from './Navbar';
import Head from 'next/head';
import { UserContext } from '@/lib/UserContext';
type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children }: Props) => {
  const [user, _]: any = useContext(UserContext);
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
          content="https://pollock-art.s3.amazonaws.com/mojo.png"
        />
        <meta property="og:url" content={`https://mojo.club`} />
        <meta property="og:title" content="Mojo" />
        <meta property="og:description" content="P2P Sports Betting" />
        <meta
          property="og:image"
          content="https://pollock-art.s3.amazonaws.com/mojo.png"
        />
      </Head>
      <div>
        {user !== null && <Navbar />}
        <div className="container lg:w-1/2 mx-auto lg:px-4 pb-10">
          {children}
        </div>
      </div>
      <footer className="footer text-base-content footer-center">
        <p>Copyright © 2023 - All right reserved by Mojo</p>
      </footer>
    </div>
  );
};

export default Layout;
